// JavaScript widget to display list of articles associated with an
// arXiv author id. See https://arxiv.org/help/myarticles
//
// Copyright (C) 2009-2011 arXiv.org
// Modified by Christian Lawson-Perfect, 2015 and Josue Tonelli-Cueto, 2019
//
// The JavaScript code in this page is free software: you can
// redistribute it and/or modify it under the terms of the GNU
// General Public License (GNU GPL) as published by the Free Software
// Foundation, either version 3 of the License, or (at your option)
// any later version.  The code is distributed WITHOUT ANY WARRANTY;
// without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
//
// As additional permission under GNU GPL version 3 section 7, you
// may distribute non-source (e.g., minimized or compacted) forms of
// that code without the copy of the GNU GPL normally required by
// section 4, provided you include this license notice and a URL
// through which recipients can access the Corresponding Source.
//
// We note that this version need the class btn btn-arxiv to display
// propperly the button. This can be defined as follows:
/*
.btn-arxiv, .btn-arxiv:active{
  background-color: #00ff00;
  border-color : #F3BC1B;
  color: #F3BC1B;
  display: inline;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  width:30%;
  font-size:medium;
  float:right;
  font-weight: normal;
  font-style: normal;
  font-variant:normal;
  height:1.5em;
  width:15%;
  padding: 0em 0em;
  text-align: center;
}

.btn-arxiv:hover, .btn-arxiv:focus{
    background-color: #F3BC1B;
    border-color: #00ff00;
    color: #00ff00;
    display: inline;
    font-variant:inherit;
    font-style:inherit;
    width:30%;
    font-size:medium;
    float:right;
    font-weight: normal;
    font-style: normal;
    font-variant:normal;
    height:1.5em;
    width:15%;
    padding: 0em 0em;
    text-align: center;
}
*/

var arxiv_authorid = "0000-0002-2904-1215";

var headID = document.getElementsByTagName("head")[0];
var newScript = document.createElement('script');
var urlPrefix = 'https://arxiv.org/a/';

newScript.src = urlPrefix + arxiv_authorid + '.js';


headID.appendChild(newScript);


//No need for ManageDefaults


// IE doesn't like &apos; which we have in JSON data, so change to numeric entity
function htmlFix(html)
{
  	var re = new RegExp('&apos;', 'g');
	html = html.replace(re,'&#39;');
	return html;
}


function jsonarXivFeed(feed)
{
    feed.entries.sort(function(a,b) {
      var pa = a.published;
      var pb = b.published;
      return pa<pb ? 1 : pa>pb ? -1 : 0;
    })

    makearXiv(feed);
}

function makearXiv(feed)
{
    var x = 0;
    //Much of this style is taken from https://arxiv.org/arXiv.css
    var html = '<div id="arxivcontainer">\n';
    var format_name = '';
    //Everything is contained in a dl
    html += '<dl>\n';
    //Add each entry
    num_entries = feed.entries.length;
    extra_entries = false;

    for (x=0; x<num_entries; x++) {
	    //open a set of divs to contain the various fields
	    html+='<dd style="padding-bottom:1em;">\n\t<div class="meta" style="line-height:130%;">\n\t\t<div class="list-title" style="font-size:medium;">\n'
	    //Add the title in a span
	    html += '\t\t\t'+ '<em><b>' + feed.entries[x].title+ '</b></em>'+ '<a  class="btn btn-arxiv" href="' + feed.entries[x].id.substring(0, feed.entries[x].id.length - 2) + '" role="button">arXiv:'+feed.entries[x].id.substring(21, feed.entries[x].id.length - 2)+'</a>' +'\n\t\t</div>';
	    //add authors in a div
	    html += '\t\t<div class="list-authors" style="font-weight:normal;font-size:medium;text-decoration:none;">&ensp;'+feed.entries[x].authors+'</div>\n';
	    //Add the subject in a div
		html += '\t\t<div class="list-subjects" style="font-size:medium;"><span class="descriptor">&ensp;Subject:</span> ' + feed.entries[x].subject;
		//Add non-primaries if available
		    if (feed.entries[x].categories && feed.entries[x].categories.length > 2) {
          for(y=1;y<feed.entries[x].categories.length;y++){
			    if(feed.entries[x].categories[y][feed.entries[x].categories[y].length-1]==')'){
          //There is an issue with Numerical Analysis (math.NA). It can be duplicated. The reason is that Numerical Analysis (cs.NA) is stored also as Numerical Analysis (math.NA) in the list.
          if(feed.entries[x].categories[y]!="Numerical Analysis (math.NA)"){
            html += '; '+feed.entries[x].categories[y];
          }else{//Either Numerical Analysis (math.NA) is at position 0 and other position, or they are in consecutive positions
            if(feed.entries[x].categories[y]!=feed.entries[x].categories[y-1] && feed.entries[x].categories[y]!=feed.entries[x].categories[0]){html += '; '+feed.entries[x].categories[y];}
          }
        }}}
		//Close subjects div
		    html += '</div>\n';

	    //Add journal_ref if present
	    if (feed.entries[x].journal_ref && feed.entries[x].journal_ref.length > 1) {
		    html += '\t\t<div class="list-journal-ref" style="font-weight:normal;font-size:medium;"><span class="descriptor">&ensp;Ref:</span> ' + feed.entries[x].journal_ref + '</div>\n';
	    }
	    //Add and link DOI if present
	    if (feed.entries[x].doi && feed.entries[x].doi.length > 0) {
		    html += '\t\t<div class="list-doi" style="font-weight:normal;font-size:medium;"><span class="descriptor">&ensp;DOI:</span> ';
		    var dois = feed.entries[x].doi.split(' ');
		    for (var j in dois) {
		       html += '<a href="https://dx.doi.org/'+dois[j]+'">'+dois[j]+'</a> ';
		    }
		    html += '</div>\n';
	    }
	    //close out the div and dd
	    html += '\t</div>\n</dd>';
    }
    //close the arxiv container div
    html += '</dl>\n</div>\n'
    document.getElementById('arxivfeed').innerHTML=html;
}
