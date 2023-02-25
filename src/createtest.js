import { words } from "./data/words"

export function generate_test(test_size) {

    
    let word_list  = words


    

    let test = []

    for (let index = 0; index < test_size; index++) {
        
        
        function get_word(){
            let word = (word_list[Math.floor(Math.random()*word_list.length)].toLowerCase())

            if (test.includes(word)){
                get_word()
            }
            return word
        }

        let word = get_word()

        test.push(word)
        
    }

    let test_string = test.join(" ")
    return test_string

}

console.log(generate_test(50))
