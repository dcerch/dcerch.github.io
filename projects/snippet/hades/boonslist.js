const boons = {
  attack: [
    {
      name: 'Lightning Strike',
      description: 'Your Attack emits chain-lightning when you damage a foe.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f6/Lightning_Strike.png/revision/latest?cb=20181214185512',
    },
    {
      name: 'Tempest Strike	',
      description: 'Your Attack deals more damage and knocks foes away.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/b2/Tempest_Strike.png/revision/latest?cb=20181214015817',
    },
    {
      name: 'Swift Strike',
      description: 'Your Attack is +X% faster.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/95/Swift_Strike.png/revision/latest?cb=20190611230950',
    },
    {
      name: 'Drunken Strike',
      description: 'Your Attack inflicts Hangover.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/80/Drunken_Strike.png/revision/latest?cb=20190213003056',
    },
    {
      name: 'Frost Strike',
      description: 'Your Attack is stronger and inflicts Chill.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/65/Frost_Strike.png/revision/latest?cb=20200126153031',
    },
    {
      name: 'Strike',
      description: 'Your Attack deals +X% damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/9c/Chaos_Blessing_Strike.png/revision/latest?cb=20190121001952',
    },
    {
      name: 'Divine Strike',
      description: 'Your Attack is stronger, and can Deflect.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e6/Divine_Strike.png/revision/latest?cb=20181213194033',
    },
    {
      name: 'Deadly Strike',
      description: 'Your Attack is stronger, with +15% chance to deal Critical damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2a/Deadly_Strike.png/revision/latest?cb=20181213182421',
    },
    {
      name: 'Curse of Agony',
      description: 'Your Attack inflicts Doom.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/8/83/Curse_of_Agony.png/revision/latest?cb=20181213182630',
    },
    {
      name: 'Heartbreak Strike',
      description: 'Your Attack deals more damage and inflicts Weak.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e3/Heartbreak_Strike.png/revision/latest?cb=20181213173756',
    },
  ],
  special: [
    {
      name: 'Thunder Flourish',
      description: 'Your Special causes a lightning bolt to strike nearby foes.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/ad/Thunder_Flourish.png/revision/latest?cb=20190215170925',
    },
    {
      name: 'Tempest Flourish',
      description: 'Your Special deals more damage and knocks foes away.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/c7/Tempest_Flourish.png/revision/latest?cb=20190215170957',
    },
    {
      name: 'Swift Flourish',
      description: 'Your Special is +X% faster.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d5/Swift_Flourish.png/revision/latest?cb=20190611231009',
    },
    {
      name: 'Drunken Flourish',
      description: 'Your Special inflicts Hangover.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/46/Drunken_Flourish.png/revision/latest?cb=20190215170412',
    },
    {
      name: 'Frost Flourish',
      description: 'Your Special is stronger and inflicts Chill.	',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/6d/Frost_Flourish.png/revision/latest?cb=20200126152922',
    },
    {
      name: 'Flourish',
      description: 'Your Special deals +X% damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/4e/Chaos_Blessing_Flourish.png/revision/latest?cb=20190121001842',
    },
    {
      name: 'Divine Flourish',
      description: 'Your Special is stronger, and can Deflect.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Divine_Flourish.png/revision/latest?cb=20190215171010',
    },
    {
      name: 'Deadly Flourish',
      description: 'Your Special is stronger, with +20% chance to deal Critical Damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f6/Deadly_Flourish.png/revision/latest?cb=20190215171034',
    },
    {
      name: 'Curse of Pain',
      description: 'Your Special inflicts Doom.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a4/Curse_of_Pain.png/revision/latest?cb=20200218015506',
    },
    {
      name: 'Heartbreak Flourish',
      description: 'Your Special deals more damage and inflicts Weak.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e9/Heartbreak_Flourish.png/revision/latest?cb=20190215171021',
    },
  ],
  cast: [
    {
      name: 'Electric Shot',
      description: 'Your Cast is a burst of chain-lightning that bounces between foes.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/0/01/Electric_Shot.png/revision/latest?cb=20181229193644',
    },
    {
      name: 'Flood Shot',
      description: 'Your Cast damages foes in an area and knocks them away.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/17/Flood_Shot.png/revision/latest?cb=20181214015817',
    },
    {
      name: 'Flurry Cast',
      description: 'Your Cast is +X% faster and fully automatic.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/43/Flurry_Cast.png/revision/latest?cb=20190611231026',
    },
    {
      name: 'Trippy Shot',
      description: 'Your Cast lobs a projectile that bursts into Festive Fog.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a4/Trippy_Shot.png/revision/latest?cb=20190213003250',
    },
    {
      name: 'Crystal Beam',
      description: 'Your Cast drops a crystal that fires a beam straight ahead for 5 sec.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/4/46/Crystal_Beam.png/revision/latest?cb=20200126153104',
    },
    {
      name: 'Shot',
      description: 'Your Cast deals +X% damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Chaos_Blessing_Shot.png/revision/latest?cb=20190121001931',
    },
    {
      name: 'Phalanx Shot',
      description: 'Your Cast damages foes in a small area, and can Deflect.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/a4/Phalanx_Shot.png/revision/latest?cb=20181213183145',
    },
    {
      name: 'True Shot',
      description: 'Your Cast seeks foes, with a 10% chance to deal Critical damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/35/True_Shot.png/revision/latest?cb=20181214015821',
    },
    {
      name: 'Slicing Shot	',
      description: 'Your Cast sends a Blade Rift hurling ahead.	',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/75/Slicing_Shot.png/revision/latest?cb=20181213182739',
    },
    {
      name: 'Crush Shot	',
      description: 'Your Cast is a wide, short-range blast that inflicts Weak.	',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/a/aa/Crush_Shot.png/revision/latest?cb=20200127124952',
    },
  ],
  dash: [
    {
      name: 'Thunder Dash',
      description: 'Your Dash causes a lightning bolt to strike nearby foes.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/b4/Thunder_Dash.png/revision/latest?cb=20181214185556',
    },
    {
      name: 'Tidal Dash',
      description: 'Your Dash damages foes in an area and knocks them away.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/c8/Tidal_Dash.png/revision/latest?cb=20181214185922',
    },
    {
      name: 'Hyper Sprint',
      description: 'For X seconds after you Dash, become Sturdy and run +100% faster.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/b/be/Hyper_Sprint.png/revision/latest?cb=20190611231105',
    },
    {
      name: 'Drunken Dash',
      description: 'Your Dash inflicts foes near you with Hangover.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e2/Drunken_Dash.png/revision/latest?cb=20190213003236',
    },
    {
      name: 'Mistral Dash',
      description: 'Your Dash shoots a gust ahead that inflicts Chill.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/d/d2/Mistral_Dash.png/revision/latest?cb=20200126153149',
    },
    {
      name: 'Lunge',
      description: 'Your Dash Attack deals +X% damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/13/Chaos_Blessing_Lunge.png/revision/latest?cb=20190121001907',
    },
    {
      name: 'Divine Dash',
      description: 'Your Dash deals damage and can Deflect.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/66/Divine_Dash.png/revision/latest?cb=20190612175323',
    },
    {
      name: 'Hunter Dash',
      description: 'Your Dash-Strike deals more damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/92/Hunter_Dash.png/revision/latest?cb=20181213182600',
    },
    {
      name: 'Blade Dash',
      description: 'Your Dash creates a Blade Rift where you started.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/5/58/Blade_Dash.png/revision/latest?cb=20190612170533',
    },
    {
      name: 'Passion Dash',
      description: 'Your Dash inflicts damage where you end up, inflicting Weak.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/e0/Passion_Dash.png/revision/latest?cb=20181214015816',
    },
  ],
  call: [
    {
      name: 'Zeus\' Aid',
      description: 'Your Call makes lightning strike nearby foes repeatedly for 1.5 Sec.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ec/Zeus%27_Aid.png/revision/latest?cb=20190319212936',
    },
    {
      name: 'Poseidon\'s Aid	',
      description: 'Your Call makes you surge into foes while Impervious for 1.2 Sec.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/e/ea/Poseidon%27s_Aid.png/revision/latest?cb=20190319204753',
    },
    {
      name: 'Quick Favor',
      description: 'Your Call charges up automatically.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/76/Quick_Favor.png/revision/latest?cb=20200706081216',
    },
    {
      name: 'Dionysus\' Aid',
      description: 'Your Call inflicts Hangover to foes all around you for 1.5 Sec.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/7/75/Dionysus%27_Aid.png/revision/latest?cb=20190319180618',
    },
    {
      name: 'Demeter\'s Aid',
      description: 'Your Call creates a winter vortex for 5 Sec., deals damage every 0.25 Sec inflicting Chill.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/3/35/Demeter%27s_Aid.png/revision/latest?cb=20200126122738',
    },
    {
      name: '❌',
      description: 'No Call for Chaos',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/c/ce/Chaos_reward.png/revision/latest?cb=20190119213332',
    },
    {
      name: 'Athena\'s Aid',
      description: 'Your Call briefly makes you Invulnerable and Deflect all attacks.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/9/91/Athena%27s_Aid.png/revision/latest?cb=20190319173050',
    },
    {
      name: 'Artemis\' Aid',
      description: 'Your Call fires a seeking arrow with +35% Critical chance.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/2/2b/Artemis%27_Aid.png/revision/latest?cb=20190317140750',
    },
    {
      name: 'Ares\' Aid',
      description: 'Your Call turns you into an Impervious Blade Rift for 1.2 Sec.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/6/63/Ares%27_Aid.png/revision/latest?cb=20190319224142',
    },
    {
      name: 'Aphrodite\'s Aid',
      description: 'Your Call fires a seeking projectile that inflicts Charm. Full Gauge Bonus: 2500 damage.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/f/f0/Aphrodite%27s_Aid.png/revision/latest?cb=20190316095357',
    },
  ],
  other: [
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
  ],
  legendary: [
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
  ],
  duo: [
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: '',
      description: '',
      image: '',
    },
    {
      name: 'Curse of Longing	',
      description: 'Your Doom effects continuously strike Weak foes.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1f/Curse_of_Longing.png/revision/latest?cb=20190316095424',
    },
    {
      name: 'Curse of Longing	',
      description: 'Your Doom effects continuously strike Weak foes.',
      image: 'https://static.wikia.nocookie.net/hades_gamepedia_en/images/1/1f/Curse_of_Longing.png/revision/latest?cb=20190316095424',
    },
  ],
}
