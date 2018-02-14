just-one-more-stegano-js

[placeholder] paragraph about steganography  
[placeholder] paragraph about this implementation  


instalation  
`npm i -g git+https://github.com/tlumko/just-one-more-stegano-js.git`

usage  
`joms hide image.png 'text to hide'`  
`joms parse image.png`  

options  
`--modify-existing-image` - modify given image rather than create new  
`--do-not-touch-transparency` - doesn't modify image transparancy  
`--generate-key` - generate random key  
`--key <keyfilename>` - use key to parse or encode image  
`--password, -p` - require password  
`--unicode, -u` - add this flag if your input is out of ascii range  
`--harm-all-pixels, --noise, -n` - harm all pixels that wasn't harmed during message concealing  
`--system <system>` - numeral system for encoding matrix. Choose one of following: base4, base8, base16, base64. base16 by default. It affects the amount info you can hide and how much image is damaged. The lower system - less damage, less info. Details in next paragraph.  

[placeholder] in-depth paragraph

faq  
- haven't heard any

roadmap  
- HUGE refactoring
- read/write data from/to file
- input validation
- input image
- min-harm encoding system autoselect
- bmp (jpeg?)
- recursive encoding
- browser client
- sudoku matrix key
- _normal_ package.json
- _normal_ readme

it is not likely that any of this features would be ever done

