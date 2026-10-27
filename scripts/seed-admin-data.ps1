<#
.SYNOPSIS
  Seed admin dashboard data untuk Bread & Circus e-commerce.
  Kategori -> Products (+gambar) -> Variants (+gambar) -> Stok via stock movement.
.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts/seed-admin-data.ps1
#>
[CmdletBinding()]
param(
  [string]$BaseUrl = 'http://13.211.208.214/api/v1',
  [string]$Email = 'admin@ecommerce.test',
  [string]$Password = 'admin123',
  [int]$ProductsPerCategory = 5,
  [string]$ImageDir = 'img_temp',
  [int]$TimeoutSec = 60
)

$ErrorActionPreference = 'Stop'
$script:imgPool = @()
$script:imgIndex = 0

function Write-Step($msg) { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Info($msg) { Write-Host "    $msg" -ForegroundColor DarkGray }
function Write-Fail($msg) { Write-Host "    [FAIL] $msg" -ForegroundColor Red }

# ---------- HTTP helpers ----------
function Get-Token {
  $res = Invoke-RestMethod -Method Post -Uri "$BaseUrl/auth/login" -ContentType 'application/json' `
    -Body (@{ email = $Email; password = $Password } | ConvertTo-Json -Compress) -TimeoutSec $TimeoutSec
  $res.access_token
}

function Get-Json($path) {
  Invoke-RestMethod -Method Get -Uri "$BaseUrl$path" -Headers @{ Authorization = "Bearer $script:token" } -TimeoutSec $TimeoutSec
}

function Post-Json($path, $body) {
  Invoke-RestMethod -Method Post -Uri "$BaseUrl$path" -ContentType 'application/json' `
    -Headers @{ Authorization = "Bearer $script:token" } -Body ($body | ConvertTo-Json -Compress) -TimeoutSec $TimeoutSec
}

function Post-File($path, $filePath, $alt, $sortOrder) {
  $args = @('-s', '-X', 'POST', "$BaseUrl$path", '-H', "Authorization: Bearer $script:token",
    '-F', "file=@$filePath", '-F', "alt=$alt", '-F', "sort_order=$sortOrder", '-w', "`n%{http_code}")
  $raw = & curl.exe @args
  $code = ($raw | Select-Object -Last 1).Trim()
  if ($code -ne '201') { throw "upload failed ($code): $filePath" }
}

function Next-Image {
  $f = $script:imgPool[$script:imgIndex % $script:imgPool.Count]
  $script:imgIndex++
  $f.FullName
}

# ---------- Data ----------
$categories = @(
  @{ name = 'Tees & Graphic';       base = 189000;  weight = 220;  style = 'size'   }
  @{ name = 'Hoodies & Sweats';     base = 449000;  weight = 650;  style = 'size'   }
  @{ name = 'Outerwear';            base = 1299000; weight = 1100; style = 'size'   }
  @{ name = 'Denim';                base = 549000;  weight = 720;  style = 'size'   }
  @{ name = 'Footwear';             base = 899000;  weight = 950;  style = 'shoesize' }
  @{ name = 'Headwear';             base = 179000;  weight = 180;  style = 'color'  }
  @{ name = 'Bags';                 base = 349000;  weight = 480;  style = 'onesize' }
  @{ name = 'Accessories';          base = 159000;  weight = 150;  style = 'color'  }
  @{ name = 'Eyewear';              base = 279000;  weight = 120;  style = 'onesize' }
  @{ name = 'Socks & Intimates';    base = 99000;   weight = 90;   style = 'pack'   }
)

$productsByCategory = @{
  'Tees & Graphic'    = @('Riot Print Tee', 'Kaos STATEMENT No.7', 'Circus Poster Tee', 'Graphic Logo Oversized Tee', 'Tee Feed Your Style')
  'Hoodies & Sweats'  = @('Midnight Zip Hoodie', 'Sweatshirt Afterhours', 'Hoodie Neon Ticket', 'Crewneck Big Top', 'Fleece Sweat Loud Silence')
  'Outerwear'         = @('Varsity Jacket Neon Hours', 'Bomber Circus Act II', 'Coach Jacket Static Red', 'Windbreaker Main Character', 'Jaket Parka Voltage')
  'Denim'             = @('Wide-Leg Denim Ripped', 'Denim Jacket Static', 'Loose Fit Jeans Big Top', 'Mom Jeans Afterdark', 'Celana Denim Oversized')
  'Footwear'          = @('High-Top Big Top Sneakers', 'Platform Boot Sirkus', 'Retro Court Purple', 'Sepatu Kanvas Bold Claim', 'Chunky Sneaker Riot')
  'Headwear'          = @('Bucket Hat Neon Circus', 'Trucker Cap Afterdark', 'Beanie Noir', 'Snapback Riot Print', 'Topi Crew Bold')
  'Bags'              = @('Crossbody Ticket to Show', 'Tote Ransel01', 'Backpack Afterhours', 'Sling Bag Static Red', 'Tas Ransel Neon')
  'Accessories'       = @('Chain Belt Voltage', 'Bandana Loud Silence', 'Scarf Purple Haze', 'Wallet Big Top', 'Aksesoris Neon Hours')
  'Eyewear'           = @('Shades Main Character', 'Frame Retina Red', 'Kacamata Retro Circus', 'Sunglasses Blackout', 'Glasses Oxide Round')
  'Socks & Intimates' = @('Socks Noise Pattern 3-Pack', 'Boxers Bold Claim', 'Socks Voltage Stripe', 'Underwear Comfy Black', 'Stocking Neon Ticket')
}

$variantNames = @{
  'size'     = @('Size XS', 'Size S', 'Size M', 'Size L', 'Size XL')
  'shoesize' = @('Size 39', 'Size 40', 'Size 41', 'Size 42', 'Size 43')
  'color'    = @('Hitam', 'Bone', 'Oxide Red', 'Purple Haze', 'Navy')
  'onesize'  = @('One Size')
  'pack'     = @('Single Pack', 'Double Pack', 'Triple Pack')
}

# ---------- Main ----------
Write-Step "Login $Email"
$script:token = Get-Token
Write-Info 'token acquired'

Write-Step "Scan image pool: $ImageDir"
$script:imgPool = @(Get-ChildItem $ImageDir -File | Where-Object { $_.Extension -match '^\.(jpg|jpeg|png)$' } | Sort-Object Name)
if ($script:imgPool.Count -eq 0) { throw "no images found in $ImageDir" }
Write-Info "$($script:imgPool.Count) images"

Write-Step 'Categories'
$existing = @{}
foreach ($c in (Get-Json '/categories').categories) { $existing[$c.name.ToLower()] = $c.id }

$catMap = @{}
$catCode = @{}
$i = 0
foreach ($cat in $categories) {
  $i++
  $code = 'C{0:d2}' -f $i
  $key = $cat.name.ToLower()
  if ($existing.ContainsKey($key)) {
    $catMap[$cat.name] = $existing[$key]
    $catCode[$cat.name] = $code
    Write-Info "exists  $($cat.name)"
  }
  else {
    try {
      $res = Post-Json '/admin/categories' @{ name = $cat.name; description = "Bread & Circus - $($cat.name) collection" }
      $catMap[$cat.name] = $res.category.id
      $catCode[$cat.name] = $code
      Write-Info "created $($cat.name) -> $($res.category.id)"
    }
    catch {
      Write-Fail "category $($cat.name): $($_.Exception.Message)"
    }
  }
}

Write-Step "Products ($($categories.Count) x $ProductsPerCategory)"
$totalProducts = $categories.Count * $ProductsPerCategory
$created = 0
$skipped = 0
$failed = 0
$prodIdx = 0

# existing products indexed by name (idempotent re-run)
$existingProducts = @{}
$epage = 1
do {
  $pres2 = Get-Json "/admin/products?page=$epage&page_size=100"
  foreach ($pp in $pres2.products) { $existingProducts[$pp.name] = $pp }
  $epage++
} while ($existingProducts.Count -lt $pres2.meta.total -and $epage -le 20)
Write-Info "existing products: $($existingProducts.Count)"

foreach ($cat in $categories) {
  $cid = $catMap[$cat.name]
  if (-not $cid) { continue }
  $names = $productsByCategory[$cat.name]
  for ($p = 0; $p -lt [Math]::Min($ProductsPerCategory, $names.Count); $p++) {
    $prodIdx++
    $pname = $names[$p]
    $pdesc = "$pname - part of the Bread & Circus streetwear drop. Feed your style, enjoy the show."
    $style = $cat.style
    $vNames = $variantNames[$style]
    $vCount = 1 + ($prodIdx % 3)
    $skuBase = 'BC-{0}-{1:d2}' -f $catCode[$cat.name], ($p + 1)

    try {
      if ($existingProducts.ContainsKey($pname)) {
        $prodId = $existingProducts[$pname].id
        $skipped++
        $knownSkus = @{}
        try {
          $vres0 = Get-Json "/admin/products/$prodId/variants"
          foreach ($kv in $vres0.variants) { $knownSkus[$kv.sku] = $kv }
        } catch { }
      }
      else {
        $pres = Post-Json '/admin/products' @{ category_id = $cid; name = $pname; description = $pdesc }
        $prodId = $pres.product.id
        $created++
        $knownSkus = @{}
        $imgCount = 1 + ($prodIdx % 2)
        for ($k = 0; $k -lt $imgCount; $k++) {
          $file = Next-Image
          try { Post-File "/admin/products/$prodId/images" $file "$pname" $k } catch { Write-Fail "image $pname : $($_.Exception.Message)" }
        }
      }

      # variants (1-3)
      for ($v = 0; $v -lt $vCount; $v++) {
        $vname = $vNames[$v % $vNames.Count]
        $price = [Math]::Round(($cat.base * (1 + 0.05 * $v)) / 1000) * 1000
        $weight = [int]($cat.weight * (1 + 0.1 * $v))
        $sku = "$skuBase-$($v + 1)"
        try {
          if ($knownSkus.ContainsKey($sku)) {
            $variantId = $knownSkus[$sku].id
            $qtyNow = $knownSkus[$sku].inventory.quantity
            $hasImg = $knownSkus[$sku].images.Count -gt 0
          }
          else {
            $vres = Post-Json "/admin/products/$prodId/variants" @{ sku = $sku; name = $vname; price = $price; weight_grams = $weight }
            $variantId = $vres.variant.id
            $qtyNow = 0
            $hasImg = $false
          }

          # variant image
          if (-not $hasImg) {
            try { Post-File "/admin/products/$prodId/variants/$variantId/images" (Next-Image) "$pname - $vname" 0 } catch { Write-Fail "variant image $sku : $($_.Exception.Message)" }
          }

          # stock via stock movement (only when still empty)
          if ($qtyNow -le 0) {
            $qty = if (($prodIdx + $v) % 7 -eq 0) { Get-Random -Minimum 2 -Maximum 10 } else { Get-Random -Minimum 20 -Maximum 200 }
            try {
              $null = Post-Json "/admin/products/$prodId/variants/$variantId/inventory/movements" @{ type = 'RESTOCK'; quantity = $qty; note = 'seed initial stock' }
            }
            catch {
              $inv = Get-Json "/admin/products/$prodId/variants/$variantId/inventory" 2>$null
              if ($inv) { Write-Info "stock skipped for $sku (inventory row missing)" }
              else { Write-Fail "stock $sku : $($_.Exception.Message)" }
            }
          }
        }
        catch { Write-Fail "variant $sku : $($_.Exception.Message)" }
      }
      Write-Info ("{0}/{1} {2}" -f $prodIdx, $totalProducts, $pname)
    }
    catch {
      $failed++
      Write-Fail "product $pname : $($_.Exception.Message)"
    }
  }
}

Write-Step 'Verify'
$pall = @()
$page = 1
do {
  $res = Get-Json "/admin/products?page=$page&page_size=100"
  $pall += $res.products
  $page++
} while ($pall.Count -lt $res.meta.total -and $page -le 20)

$withVariants = @($pall | Where-Object { $_.variants -and $_.variants.Count -gt 0 })
$withImages = @($pall | Where-Object { $_.images -and $_.images.Count -gt 0 })
Write-Info "total products      : $($pall.Count)"
Write-Info "punya variants      : $($withVariants.Count)"
Write-Info "punya product image : $($withImages.Count)"

$variantTotal = 0
$imageTotal = 0
$lowStock = 0
foreach ($p in $pall) {
  $variantTotal += $p.variants.Count
  $imageTotal += $p.images.Count
}
Write-Info "total variants      : $variantTotal"
Write-Info "total product images: $imageTotal"

try {
  $m = Get-Json '/admin/metrics/summary'
  Write-Info ("metrics: revenue={0} activeOrders={1} newUsers={2} lowStock={3}" -f $m.total_revenue, $m.active_orders, $m.new_users, $m.low_stock_count)
}
catch { Write-Fail "metrics: $($_.Exception.Message)" }

Write-Step "Done. products created=$created reused=$skipped failed=$failed"
