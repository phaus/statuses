/*jslint vars: true, white: true */
/*global jQuery */

(function($) {

"use strict";

var imgRegEx = /!(http[^\s]+)/gi;
var markdownImgRegEx = /!\[(.+)\]\((http[^\s]+)\)/gi;
var entryFormButton = $(".entry-form button");

$("#text").charCount(140, entryFormButton);

// quick reply
$(".updates").on("click", ".post-content", function(ev) {
    $("div.new-reply").remove();
    var post = $(this).closest(".post");
    var postURI = $("a.permalink", post).attr("href");
    $('<div />').addClass("new-reply").appendTo(post).
        load(postURI + " form.reply-form", // XXX: introduces duplicate IDs
            function(response, status, xhr) {
                var input = $(".new-reply input[name=reply-text]", post);
                var button = $(".new-reply button", post);
                input.charCount(140, button);
                focusField(input);
            }
        );
});

$(".post-content").each(function(i, node) {
    var contentField = $(node);
    var currentText = contentField.text();
    currentText.replace(markdownImgRegEx, function(match, p1, p2, offset, string) {
        $("<img />").attr("src", p2).attr("alt", p1).insertAfter(contentField);
    });

    currentText.replace(imgRegEx, function(match, p1, offset, string) {
        $('<img alt="image" />').attr("src", p1).insertAfter(contentField);
    });
});

function focusField(field) {
    field.bind("focus", moveCursorToEOL); // XXX: no need for separate event handler?
    field.focus();
    field.unbind("focus", moveCursorToEOL);
}

// move cursor to the end -- XXX: crude!?
function moveCursorToEOL() {
    var val = this.value;
    this.value = "";
    this.value = val;
}

}(jQuery));
