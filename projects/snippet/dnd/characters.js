var augustin = {
  "content": null,
  "embeds": [
    {
      "title": "Personality",
      "description": "Creative, heroic, mild-mannered, determined, brave and kindhearted, although he's also dim-witted, bumbling, gullible, incompetent, clumsy, and clueless. Also a horrible judge of character and he thinks that the bad guys are his allies and his allies are his enemies.",
      "color": 11522611,
      "fields": [
        {
          "name": "Attributes",
          "value": "STR: 8 (-1)\nDEX: 10 (0)\nCON: 8 (-1)\nINT: 14 (2)\nWIS: 12 (1)\nCHA: 16 (3)"
        },
        {
          "name": "Gadgets",
          "value": "Binoculars, umbrella, coat, chopper, cuffs, hands, arms, legs, neck, top-secret phone, skates, springs"
        },
        {
          "name": "Backstory",
          "value": "Augustin was at the top of his game back in 1983 - often called Inspector Gadget by the denizens of Metro City. Day in and day out, he consistently thwarted George Claw and his M.A.D organization's attempts for wealth and domination. However, Dr. Claw would one day get his revenge. Gadget's niece Penny and his dog Brain were taken to Dr. Claw's castle. Upon arrival, Augustin found Penny and Brain being tortured by Billy Thaw (Claw's nephew) and M.A.D Cat (Claw's cat) respectfully. With no time to spare, Gadget sprung into action - using his extendo-arms to rescue his family. His arms were suddenly sliced by a fiery magic blade wielded by George Claw himself. The pain from the slice would normally cause anyone to pass out from shock but Gadget instead stood their frozen in terror as he witnesses his arch-enemy's face for the first and last time."
        },
        {
          "name": "Current Day",
          "value": "Gadget wakes up decades later naked on an operating bed feeling uneasy. His thoughts are swirling and conflicting with his own. Doctors with technological breathing masks and magically floating surgical equipment are all that's in purview. Panic begins to set in as the inspector desperately pulls out tubes connected to his body and scrambles to get up. He makes it out of the room and out of the \"hospital\". As he opens the front doors, his eyes burn from the outdoor light. He sees Metro City but it's not the city he knows. It is much more than what he remembers. Hearing rushed footsteps behind him, he sprints to the local police building and charges in to ask for help. He quickly realizes that the place is abandoned, lights off, paper scattered and trash everywhere. The compounding confusion, anxiety and sadness sets in as he falls to his knees. Suddenly, he hears the distant echoing of Penny, giving him the attentiveness and curiosity he needs to keep going. He grabs some nearby clothes and presses on."
        },
        {
          "name": "Quirks",
          "value": "• Gadget is a personality core living in the body of criminal. When disparate decisions need to be made, he must make a CON saving throw of 10 or more to make the decision he wants.\n• Gadget and his criminal compadre are not very compatible and typically are fighting to completely overwrite the other core.\n• Obsessive tendency to say \"go-go-gadget\" before for using any of his gadgets.\n• Body contains similar technological gadgets to what he once had and is modifiable by \"ripperdocs\" (who are doctors who specialize in cybernetics).\n• Convinced that his niece, dog and Dr. Claw are still alive given his circumstances."
        }
      ],
      "author": {
        "name": "Augustin Gadget",
        "url": "https://inspectorgadget.fandom.com/wiki/Gadgetpedia",
        "icon_url": "https://i.imgur.com/u36YlFi.png"
      },
      "footer": {
        "text": "Don't worry, Chief! I'm always on duty!",
        "icon_url": "https://i.imgur.com/r0PAQqe.png"
      },
      "timestamp": "1983-09-12T16:00:00.000Z",
      "image": {
        "url": "https://i.imgur.com/3DqJuwc.png"
      },
      "thumbnail": {
        "url": "https://i.imgur.com/KYP0wHd.png"
      }
    }
  ],
  "username": "D&D Character Sheet",
  "avatar_url": "https://i.imgur.com/73Cs5G2.png"
};

document.getElementById("augustin").addEventListener("click",function(e){
  var request = new XMLHttpRequest();
  request.open("POST", "https://discord.com/api/webhooks/805494899238764595/Ve93SQv-2zJAaCeJ_57aL0Uw61svMf6TCodnxket7wBdrexiF21deck99kgLCjoS9rIZ");
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(augustin));
},false);
