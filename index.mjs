import natural from "natural";
const language = "EN"
const defaultCategory = 'N';
const defaultCategoryCapitalized = 'NNP';

var lexicon = new natural.Lexicon(language, defaultCategory, defaultCategoryCapitalized);
var ruleSet = new natural.RuleSet('EN');
var tagger = new natural.BrillPOSTagger(lexicon, ruleSet);

var tokenizer = new natural.WordTokenizer();

// console.log(tagger.tag(tokenizer.tokenize("You see all you can")).taggedWords);

function shakespeare(text) {
    text = text
        .replace(/'ve/gi, " have")
        .replace(/hey/gi, "hark")
        .replace(/(?:it is)|(?:it's)/gi, "'tis")
        .replace(/it was/gi, "'twas")
        .replace(/friend/gi, "cousin")
        .replace(/(sh|c|w)ould/gi, "$1ouldst")
        .replace(/over/gi, "o'er")
        .replace(/have|has/gi, "hath")
        .replace(/spoke/gi, "spake")
        .replace(/the other/gi, "t'other")
        .replace(/your(\s+[aeiou])/gi, "thine$1")
        .replace(/yourself/gi, "thyself")
        .replace(/your/gi, "thy")
        .replace(/you/gi, "thou");
    
    let tokenized = tokenizer.tokenize(text);
    let tagged = tagger.tag(tokenized).taggedWords;

    let imperative;

    for(let i = 0; i < tagged.length; i++) {
        if(tagged[i].tag === "VBP" && typeof imperative === "undefined") {
            imperative = i + 1;
        } else if(tagged[i].tag === "NN" && typeof imperative === "undefined") {
            imperative = false;
        }

        if(tagged[i].tag === "VBP" || tagged[i].tag === "VBD" || tagged[i].tag === "MD") {
            if(tokenized[i].match(/ouldst/)) continue;
            if(tokenized[i] === "do") continue;
            if(tokenized[i] == "will") {
                tokenized[i] = "shall";
                continue;
            }
            switch(tokenized[i].slice(-1)) {
                case "e":
                    tokenized[i] += "th";
                break;
                case "d":
                    tokenized[i] += "st";
                break;
                default:
                    tokenized[i] += "eth";
            }
        }
    }

    if(imperative) {
        text = [...tokenized.slice(0, imperative), "thee", ...tokenized.slice(imperative)].join(" ");
    } else {
        text = tokenized.join(" ");
    }

    return (Math.floor(Math.random() * 50) ? text : "Get thee to a nunnery");
}

console.log(shakespeare("do not fret, father. I will do my chore"));