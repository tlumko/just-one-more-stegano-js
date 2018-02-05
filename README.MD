just-one-more-stegano-js

paragraph about steganography
paragraph about this implementation

instalation
npm i -g git+https://github.com/tlumko/just-one-more-stegano-js.git

usage
joms hide image.png 'text to hide'
joms parse image.png

options
--modify-existing-image - self explaining
--dont-touch-my-alpha-channel - not modify image transparancy.
--generate-key - generate random key which is needed to parse image
--key <keyfilename> - use key to parse or encode image 

in-depth paragrpah

faq
- haven't heard any

roadmap
- not linear pixel usage
- password
- encoding with lower impact (8-bit matrix rather than 16-bit)
- sudoku matrix key
- read/write text from/to file
- apply modifications to all unused pixels
- hide info different file format
- bmp
- recursive encoding
- browser client

it is not likely that any of this features would be ever done

