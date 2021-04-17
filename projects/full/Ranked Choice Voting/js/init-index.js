//Pool of Hackathon names
const teamNames = ["Diva Code", "Trojan Hash Defiance", "The Bug Stops Here", "Creep Access", "The Bug Slayers", "Gopher Hoppers", "Smash Hack Gremlins", "Daemon Byte Divas", "Bits N' Bytes", "Hack O' Holics", "Ether Bots", "Bright Byte Domain", "Pac Man Bytes", "Hack Elite", "Cyber Bot Demons", "Byte Hogs", "Pentium Predators", "Poker Foobars", "Tragic Bytes", "Red Hat Zombies", "Grep Tribe", "The Hip Script", "Pings with Things", "Hugs for Bugs", "Kick Bit Fever", "The Hip Trojans", "Babes Got Byte", "System in Bits", "Mac Brood Alliance", "Bootstrap Paradox", "Hackover Ooze", "Trojan Hex", "Spam Bytes", "Python's Got Ping", "The Suave Swing", "Bug Hunter Squad", "Oracle Nerd Squad", "Trojan Scum Riders", "Compress Zip Bots", "Bot Systematic", "Odd Bit Loaders", "Love Bot Conspiracy", "Hack Alternative", "Troff Junkies", "Pine Hack Salvation", "Opaque Soul Virus", "The Zip Tomcats", "Hack Linguist", "Bit Ends", "Virus Vixens", "Bug-Byte League", "Flow Bit Theory", "Sinister Ping Bot", "Cookie Army", "Space Reboot Chronicles", "Gopher Bots", "Code Linguists", "Bro Code Clan", "Plugin Immortals", "Kerberos Clan", "Stellar Hack Mercenaries", "Bots With Dots", "Zip Virus Latte", "Purple Byte Riot", "Ether Bug Demons", "Babes With Bot Hacks", "Lunatic Byte", "Zip Breed Theory", "Cryptic Parallelization", "Binary Bombers", "Trojan Wave", "Ctrl Alt Elite", "Sinister Alphanumeric Protocol", "Abstract Byte Class", "Slick Worminators", "Grey Cell Interface", "Bitbucker Magnets", "The Mac Hackers", "Bit Architecture", "Code Her Thing", "Mechanical Bit Souls", "The Hack Backpackers", "Shareware Magnets", "Mind Hack Zombies", "Compatible in Bits", "The Still Variables", "Alpha Interface", "The Apache Vibe", "We Do It With Cookies", "End Abend", "Byte Mechanics", "Unscript The Hack", "Avidemux Gremlins", "Code Stomp", "Space Penguin Hackover", "Abstract Evolution", "Byte For Bait", "App Alpha Clan", "Boolean Pundits", "Soul Celestia", "Mind Install", "Ode To Code", "Bit Lords", "The Pseudo Bug Epic", "Beta Up Your Mind", "Purple Bit Logic", "Debug Thugs", "Imagery of Markup", "Byte System", "The Tag Ends", "Pandora Reeboot", "Plug Mind Configuration", "Data Poltergeists", "Ibot Interface", "Binary Tree Nodes", "Debug Starts Here", "Monad Amry", "Entropy Crusade", "The Epic Byte", "Loader Logic", "The Link Clowns", "Geek Navi Hex", "Compiler Charisma", "Profiler Divas", "Hat Static", "Binary Fetch", "The Roto Command", "The Whack Hack", "Open Class System", "Parallel Transcend", "Mind Mine Data", "Nano Zillas", "Monster Memory Markup", "Stimulation Access Zombies", "Mind Map Cache", "Byte Karma", "Crack Em' Young"];

//Each new input will pull a random Hackathon name
$('#rcvPollAddChoices').click(function() {
  $('#rcvPollChoices').append('<input type="text" class="form-control mb-2" placeholder="' + teamNames[Math.floor(Math.random()*teamNames.length)] + '">');
});