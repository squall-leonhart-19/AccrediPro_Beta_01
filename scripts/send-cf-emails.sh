#!/bin/bash

# This script sends welcome emails to all CF users via the webhook

USERS=(
  "unity.sutton@gmail.com|Patricia|Sutton"
  "judysmason@gmail.com|Judy|Mason"
  "cecelia.fares@gmail.com|Cecelia|Bowens Fares"
  "yhjones79@gmail.com|Yvette|Jones"
  "gracepeters1955@yahoo.com|Grace|Peters"
  "jennifersalvino@me.com|Jennifer|Salvino"
  "jennifersalvino@icloud.com|Jennifer|Salvino"
  "dreamer2000@aol.com|Pamela|Franks"
  "helenwealth005@gmail.com|Helen|Eze"
  "nicolemackay15@gmail.com|Nicole|Mackay"
  "stephirn620@gmail.com|Stephanie|Credle"
  "riveraae46@gmail.com|Anna|Rivera"
  "gurnee256@yahoo.com|ClaRita|dela Paz"
  "scarriondpt@gmail.com|Shirley|Carrion"
  "joyce.michelle.33@gmail.com|Michelle|Joyce"
  "info@alignbyzen.online|Marieliz|Velazquez"
  "bower.danielle@yahoo.com|Danielle|Bower"
  "megvinc@yahoo.com|Margaret|Michael"
  "klweese1973@gmail.com|Katherine|Weese Ulsh"
  "tammyrfanz@gmail.com|Tammy|Fanz"
  "lisaharris16@yahoo.com|Lisa|Harris"
  "patriciatrammell1967@gmail.com|Patricia|Trammell"
  "sarahlamccracken@gmail.com|Sarah|McCracken"
  "willisflorette@yahoo.com|Florette|Willis"
  "bigmutt12@gmail.com|Amanda|Dobbs"
  "lizd@nurturedbyhart.com|Lizbeth|Domday"
  "pmlrn4@aol.com|Pamela|Herring"
  "smunnlyn@gmail.com|Shavonne|Munnlyn"
  "support@herwellnessharmony.com|Sheila|McFarland"
  "tantigirl.1237@gmail.com|Karen|Persad Ramgoolie"
  "elisa@southbayrnservices.org|Elisa|Silva"
  "cherrydhc@yahoo.com|Cheryl|Crichlow"
  "talikramer2001@gmail.com|Tali|Kramer"
  "jodyjodymusic@gmail.com|Jody|Napper"
  "priestlyplanet@gmail.com|Betty|Chirri"
  "rbanatte@gmail.com|Roldine|Banatte-Garcon"
  "lsteinke4811@gmail.com|Lydia|Wallace"
  "nursevalentine1201@yahoo.com|Gisele|Valentine"
  "maxinemarsh2025@outlook.com|Maxine|Bennett-Marsh"
  "sherfaller@gmail.com|Sherrie|Faller"
  "shefaller@gmail.com|Sherrie|Faller"
  "gotshalkjane@gmail.com|Jane|Gotshalk"
  "hollen82nd@proton.me|Therese|Hollen"
  "xotaengu@gmail.com|Wei|Zhang"
)

count=0
for user in "${USERS[@]}"; do
  IFS='|' read -r email first last <<< "$user"
  echo "Sending to: $email ($first $last)"
  
  curl -s -X POST https://learn.accredipro.academy/api/webhooks/clickfunnels-purchase \
    -H "Content-Type: application/json" \
    -d "{\"data\":{\"contact\":{\"email_address\":\"$email\",\"first_name\":\"$first\",\"last_name\":\"$last\"},\"line_items\":[{\"name\":\"Functional Medicine Certification Practitioner\",\"amount\":\"97\"}]}}" \
    | jq -r '.success // .error'
  
  count=$((count + 1))
  echo "---"
  sleep 1
done

echo ""
echo "Done! Sent to $count users"
