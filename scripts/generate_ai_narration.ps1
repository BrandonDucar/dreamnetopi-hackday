Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 2
$outFile = "c:\Users\brand\dreamnetopi-hackday\media\narration_90s.wav"
$synth.SetOutputToWaveFile($outFile)

$script = @"
Welcome to Dreamnetiopi: Your business, coordinated. Built for small food makers, retail pop-ups, and recurring events.
I am running Coastal Freeze Company, an artisan freeze-dried snack business in Florida.
As a food maker with messy hands handling cold trays and vacuum chambers, I wear the Plaud NotePin S.
Plaud captures my voice hands-free: logging tray counts, Harvest Right batch telemetry, and recipe R and D without touching a keyboard.
Now, watch our live coordination room in Band Protocol: room pier 48 rush.
When our strawberry supply suddenly drops, I issue a single voice directive:
Out of strawberries for Pier 48 rush. Push mango and blue raspberry. Rewrite offer. Do not publish.
Immediately, Neo4j deterministic causal graph evaluates eighteen nodes.
It protects twenty existing online pre-orders, zeroes market strawberries, and confirms fifty bags of Swicy Mango Tajín.
Next, OpenRouter routes Claude 3.5 Sonnet to rewrite the hero offer to the Pier 48 Swicy Cosmic Duo at 19 dollars and 99 cents, boosting gross margins to 76.2 percent.
Then, OpenRouter routes Llama 3.1 70B to stage five platform campaign drafts in Postiz for Instagram, TikTok ASMR, Facebook, X, and Threads.
All heavy disruption simulations and video generation runs execute on Crusoe Cloud, the energy-first AI infrastructure powered by 98.4 percent clean, carbon-negative compute.
Governance is enforced: DuploCloud hosts our human approval gate at slash approve.
The owner reviews the margin diff and taps YES.
Instantly, the live Shopify storefront updates, Postiz broadcasts, and kitchen packaging trays re-route.
And for recurring B2B orders, our Wholesale Desk turns messy retailer inquiries into owner-approved quotes in under 60 seconds.
Dreamnetiopi: when plans change, your whole team knows what happens next.
"@

$synth.Speak($script)
$synth.Dispose()
Write-Host "Generated AI Voice Narration with Crusoe at Rate 2"
