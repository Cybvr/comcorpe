param(
  [switch]$Apply,
  [switch]$Overwrite
)

$ErrorActionPreference = 'Stop'

function Read-EnvFile {
  param([string]$Path)

  $result = @{}
  foreach ($line in Get-Content -Path $Path) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith('#')) {
      continue
    }

    $parts = $line -split '=', 2
    if ($parts.Length -eq 2) {
      $result[$parts[0].Trim()] = $parts[1].Trim()
    }
  }

  return $result
}

function Get-FirestoreValue {
  param($Field)

  function Has-Prop {
    param($Object, [string]$Name)
    return $null -ne $Object.PSObject.Properties[$Name]
  }

  if ($null -eq $Field) { return $null }
  if (Has-Prop $Field 'stringValue') { return [string]$Field.stringValue }
  if (Has-Prop $Field 'integerValue') { return [string]$Field.integerValue }
  if (Has-Prop $Field 'doubleValue') { return [string]$Field.doubleValue }
  if (Has-Prop $Field 'booleanValue') { return [bool]$Field.booleanValue }
  if (Has-Prop $Field 'nullValue') { return $null }

  if (Has-Prop $Field 'arrayValue') {
    $values = @()
    if ($Field.arrayValue.values) {
      foreach ($item in $Field.arrayValue.values) {
        $values += Get-FirestoreValue $item
      }
    }
    return $values
  }

  if (Has-Prop $Field 'mapValue') {
    $map = @{}
    if ($Field.mapValue.fields) {
      foreach ($prop in $Field.mapValue.fields.PSObject.Properties) {
        $map[$prop.Name] = Get-FirestoreValue $prop.Value
      }
    }
    return $map
  }

  return $null
}

function Convert-DocumentFields {
  param($Fields)

  $result = @{}
  if ($null -eq $Fields) { return $result }

  foreach ($prop in $Fields.PSObject.Properties) {
    $result[$prop.Name] = Get-FirestoreValue $prop.Value
  }

  return $result
}

function Clean-Text {
  param([AllowNull()][string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) { return '' }
  return (($Value -replace '\s+', ' ' -replace '\s+([,.;:!?])', '$1').Trim())
}

function Strip-TrailingPunctuation {
  param([string]$Value)
  return (Clean-Text $Value) -replace '[,.;:!?]+$', ''
}

function To-Sentence {
  param([string]$Value)

  $trimmed = Clean-Text $Value
  if (-not $trimmed) { return '' }

  $normalized = $trimmed.Substring(0, 1).ToUpper() + $trimmed.Substring(1)
  if ($normalized -match '[.!?]$') { return $normalized }
  return "$normalized."
}

function Join-List {
  param([object[]]$Items)

  $cleanItems = @($Items | ForEach-Object { Clean-Text "$_" } | Where-Object { $_ })
  if ($cleanItems.Count -eq 0) { return '' }
  if ($cleanItems.Count -eq 1) { return $cleanItems[0] }
  if ($cleanItems.Count -eq 2) { return "$($cleanItems[0]) and $($cleanItems[1])" }
  return "$($cleanItems[0..($cleanItems.Count - 2)] -join ', '), and $($cleanItems[-1])"
}

function Get-ExperienceLabel {
  param([string]$YearsExp)

  $value = Clean-Text $YearsExp
  if (-not $value) { return '' }
  if ($value.Contains('15+')) { return 'senior' }
  if ($value.Contains('9-14')) { return 'seasoned' }
  if ($value.Contains('5-8')) { return 'experienced' }
  if ($value.Contains('2-4')) { return 'emerging' }
  return ''
}

function Build-Intro {
  param($Profile)

  $name = Clean-Text $Profile.name
  if (-not $name) { $name = 'This operator' }

  $role = Clean-Text $Profile.talentRole
  if (-not $role) { $role = 'specialist operator' }

  $industry = Clean-Text $Profile.industry
  $location = Clean-Text $Profile.location
  $seniority = Get-ExperienceLabel $Profile.yearsExp
  $rolePhrase = if ($seniority) { "$seniority $role" } else { $role }
  $article = if ($rolePhrase -match '^[aeiouAEIOU]') { 'an' } else { 'a' }
  $sectorPhrase = if ($industry) { " focused on $($industry.ToLower())" } else { '' }
  $locationPhrase = if ($location) { " based in $location" } else { '' }

  return "$name is $article $rolePhrase$sectorPhrase$locationPhrase"
}

function Build-Background {
  param($Profile)

  $bg = Clean-Text $Profile.bg
  if ($bg) {
    return "With a background in $(Strip-TrailingPunctuation $bg), they bring sharp commercial judgment and hands-on execution to complex growth work"
  }

  $disciplines = @($Profile.disciplines | ForEach-Object { Clean-Text "$_" } | Where-Object { $_ })
  if ($disciplines.Count -gt 0) {
    return "Their work spans $(Join-List $disciplines[0..([Math]::Min(2, $disciplines.Count - 1))]), helping teams move from strategy into delivery with clarity"
  }

  $network = @($Profile.networkAffiliations | ForEach-Object { Clean-Text "$_" } | Where-Object { $_ })
  if ($network.Count -gt 0) {
    return "They combine strategic thinking with operating discipline, with network experience across $(Join-List $network[0..([Math]::Min(1, $network.Count - 1))])"
  }

  return 'They combine strategic thinking with practical delivery, helping clients turn ambitious briefs into structured progress'
}

function Build-Closer {
  param($Profile)

  $highlights = @($Profile.highlights | ForEach-Object { Clean-Text "$_" } | Where-Object { $_ })
  if ($highlights.Count -gt 0) {
    return $highlights[0]
  }

  $availability = Clean-Text $Profile.availability
  $rate = Clean-Text $Profile.rate

  if ($availability -and $rate) {
    return "Available $($availability.ToLower()) with commercial flexibility around $rate"
  }

  if ($availability) {
    return "Available $($availability.ToLower()) for briefs that need fast alignment and accountable execution"
  }

  if ($rate) {
    return "Operates with clear commercial expectations around $rate"
  }

  return 'Best suited to briefs that need structured thinking, speed, and dependable follow-through'
}

function Build-Bio {
  param($Profile)

  $parts = @(
    (To-Sentence (Build-Intro $Profile)),
    (To-Sentence (Build-Background $Profile)),
    (To-Sentence (Build-Closer $Profile))
  ) | Where-Object { $_ }

  return (Clean-Text ($parts -join ' '))
}

function Should-SkipExisting {
  param([string]$Desc)
  return (-not $Overwrite) -and (Clean-Text $Desc).Length -gt 0
}

$envFile = Read-EnvFile '.env.local'
$apiKey = $envFile['NEXT_PUBLIC_FIREBASE_API_KEY']
$projectId = $envFile['NEXT_PUBLIC_FIREBASE_PROJECT_ID']
$email = if ($env:FIREBASE_EMAIL) { $env:FIREBASE_EMAIL.Trim().ToLower() } else { 'jide.pinheiro@comcorpe.com' }
$password = if ($env:FIREBASE_PASSWORD) { $env:FIREBASE_PASSWORD.Trim() } elseif ($envFile['COMCORPE_LOGIN_PASSWORD']) { $envFile['COMCORPE_LOGIN_PASSWORD'].Trim() } else { '' }

if (-not $apiKey -or -not $projectId) {
  throw 'Missing Firebase config in .env.local.'
}

if (-not $password) {
  throw 'Set FIREBASE_PASSWORD or COMCORPE_LOGIN_PASSWORD before running.'
}

Write-Host "Signing in as $email..."
$signInUri = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=$apiKey"
$signInBody = @{
  email = $email
  password = $password
  returnSecureToken = $true
} | ConvertTo-Json

$authResult = Invoke-RestMethod -Method Post -Uri $signInUri -ContentType 'application/json' -Body $signInBody
$idToken = $authResult.idToken

if (-not $idToken) {
  throw 'Firebase sign-in failed: no idToken returned.'
}

Write-Host "Signed in.`n"

$headers = @{
  Authorization = "Bearer $idToken"
}

$listUri = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users"
$response = Invoke-RestMethod -Method Get -Uri $listUri -Headers $headers
$documents = @($response.documents)
$talentDocs = @()

foreach ($doc in $documents) {
  $profile = Convert-DocumentFields $doc.fields
  if ($profile.role -eq 'talent') {
    $talentDocs += [PSCustomObject]@{
      Name = $doc.name
      Id = ($doc.name -split '/')[-1]
      Profile = $profile
    }
  }
}

if ($talentDocs.Count -eq 0) {
  Write-Host 'No talent profiles found.'
  exit 0
}

$planned = 0
$skipped = 0
$unchanged = 0

foreach ($entry in $talentDocs) {
  $profile = $entry.Profile
  $existingDesc = Clean-Text $profile.desc

  if (Should-SkipExisting $existingDesc) {
    Write-Host "SKIP $($entry.Id) ($($profile.name)) - existing bio already populated"
    $skipped++
    continue
  }

  $nextDesc = Build-Bio $profile
  if (-not $nextDesc) {
    Write-Host "SKIP $($entry.Id) ($($profile.name)) - not enough profile data to build bio"
    $skipped++
    continue
  }

  if ($existingDesc -eq $nextDesc) {
    Write-Host "OK   $($entry.Id) ($($profile.name)) - generated bio matches existing"
    $unchanged++
    continue
  }

  Write-Host ""
  Write-Host "$($(if ($Apply) { 'WRITE' } else { 'PLAN ' })) $($entry.Id) ($($profile.name))"
  Write-Host "  role: $($profile.talentRole)"
  if ($existingDesc) {
    Write-Host "  old:  $existingDesc"
  }
  Write-Host "  new:  $nextDesc"

  if ($Apply) {
    $patchUri = "https://firestore.googleapis.com/v1/projects/$projectId/databases/(default)/documents/users/$($entry.Id)?updateMask.fieldPaths=desc"
    $patchBody = @{
      fields = @{
        desc = @{
          stringValue = $nextDesc
        }
      }
    } | ConvertTo-Json -Depth 6

    Invoke-RestMethod -Method Patch -Uri $patchUri -Headers $headers -ContentType 'application/json' -Body $patchBody | Out-Null
  }

  $planned++
}

Write-Host ""
Write-Host "Done. $planned $($(if ($Apply) { 'written' } else { 'planned' })), $unchanged unchanged, $skipped skipped."
if (-not $Apply) {
  Write-Host 'Dry run only. Re-run with -Apply to write bios.'
}
