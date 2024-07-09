minWordLength = 1;
minTextLength = 50;
boldRatio = 0.4;
flashBorder =false;
enabledBionify = true;

function insertTextBefore(text, node, bold) {
    if (bold) {
        var span = document.createElement("span");
        span.style.fontWeight = "bolder";
        span.appendChild(document.createTextNode(text));

        node.parentNode.insertBefore(span, node);
    }
    else {
        node.parentNode.insertBefore(document.createTextNode(text), node);
    }
}

function startProcess(){
	browser.storage.sync.get("flashColor", function (result) {

		if (result.flashColor!=null && result.flashColor !== undefined){
			flashBorder=result.flashColor;			
		}
		else{
			flashBorder=false;
		}		
		browser.storage.sync.get("enableBionify", function (result) {
		
			if (result.enableBionify!=null && result.enableBionify !== undefined){
				enabledBionify=result.enableBionify;
				if (enabledBionify)
					processNode(document.body);
			}
			else{
				enabledBionify=false;
			}
				
		});
			
    });
	
}

function processNode(node) {
	
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) => {
            return (
                node.parentNode.nodeName !== 'SCRIPT' &&
                node.parentNode.nodeName !== 'NOSCRIPT' &&
                node.parentNode.nodeName !== 'STYLE' &&
                node.nodeValue.length >= minTextLength) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    });

    var node;
    while (node = walker.nextNode()) {
        var text = node.nodeValue;
        var wStart = -1, wLen = 0, eng = false;

        // English letters only
        for (var i = 0; i <= text.length; i++) { // We use <= here because we want to include the last character in the loop
            var cEng = i < text.length ? /[a-zA-Z]/.test(text[i]) : false;

            if (i == text.length || eng !== cEng) {
                // State flipped or end of string
                if (eng && wLen >= minWordLength) {
                    var word = text.substring(wStart, wStart + wLen);
                    var numBold = Math.ceil(word.length * boldRatio);
                    var bt = word.substring(0, numBold), nt = word.substring(numBold);
                    insertTextBefore(bt, node, true);
                    insertTextBefore(nt, node, false);
                } else if (wLen > 0) {
                    var word = text.substring(wStart, wStart + wLen);
                    insertTextBefore(word, node, false);
                }
                wStart = i;
                wLen = 1;
                eng = cEng;
            } else {
                wLen++;
            }
        }

        node.nodeValue = ""; // Can't remove the node (otherwise the tree walker will break) so just set it to empty
    }
	
	if (flashBorder)
		document.body.style.border = "2px solid red";;
}

startProcess();
