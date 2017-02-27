# Secret Private  
  
--------------------------------------------------------  
  
### TODO:  
--- now: redux ---  
web sockets  
    - make cardsJSON live on the state. - use the selected prop in the card instead of deleting from available card list
    - have char select highlighting be based on store state  
        - will prolly need to do this for the game phase as well  
    - continue web socket multiplayer stuff  
        - state changing with each action  
  
--- later ---  
- favicon :)  
- was not carful with the array object of cards, so im pretty sure lots of things are sharing the same card object, which explains why in the death function we have 3 deaths and not 2...  
- replace the long import in game rework with an import all as <name> then reference the methods with dot notation
- fix unselecting highlighting 
- fix card playing highlighting  
- organization of files  
- Move inline css to css file
- LOTS OF STYLE zzz  
- Picking phase turns, diff color for diff player  
- Player turns (and prompts)  
- Separate components
- hover for card info  
- sound  
- ***Implement specials (descriptions, death/hp loss animations, spicy stuff)  
  
--------------------------------------------------------     
    
https://devpost.com/software/sprite-battle#updates