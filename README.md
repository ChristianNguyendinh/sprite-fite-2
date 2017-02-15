# Secret Private  
  
--------------------------------------------------------  
  
### TODO:  
--- now: redux ---  
Convert gameboard to redux:  
    - Use store instead of game board state  
        - remove all non-standalone visual component state  
        - review and remove outdated state
    - Make sure we didnt break anything - we broke everything - we fixed everything  
 
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