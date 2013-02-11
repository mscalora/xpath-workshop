
	// lifted & cleaned up from from http://www.w3schools.com/xml/xml_validator.asp
	var xt="", h3OK=1;
	function checkErrorXML(x) {
		xt="";
		h3OK=1;
		checkXML(x)
	}
	function checkXML(n) {
		var l, i, nam;
		nam = n.nodeName;
		if (nam=="h3") if (h3OK==0) return; else h3OK=0;
		if (nam=="#text") xt=xt + n.nodeValue + "\n";
		l = n.childNodes.length;
		for (i=0;i<l;i++) checkXML(n.childNodes[i]);
	}
	function validateXML(text,messageElement) {
		if (document.implementation.createDocument) {
			var parser=new DOMParser();
			var xmlDoc=parser.parseFromString(text,"text/xml");

			if (xmlDoc.getElementsByTagName("parsererror").length>0) {
				checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
				messageElement.find('.details').text(xt);
				messageElement.addClass('error').find('.marker').text("Invald XML");
			} else {
				messageElement.find('.details').text('');
				messageElement.removeClass('error').find('.marker').text("Valid XML");
			}
		} else {
			messageElement.find('.details').text('');
			messageElement.removeClass('error').find('.marker').text('Your browser cannot handle XML validation');
		}
	}
	function validateXmlTextarea(teSelector,msgSelector) {
		validateXML($(teSelector).val(),$(msgSelector));
	}
	$(function(){
		$('#in').on('keyup paste cut change drop blur',function(){
			validateXmlTextarea(this,'#in-label .message');
		});
		validateXmlTextarea('#in','#in-label .message');
	});

	resultTypes = {};
	resultTypes[XPathResult.NUMBER_TYPE] = "NUMBER_TYPE";
	resultTypes[XPathResult.STRING_TYPE] = "STRING_TYPE";
	resultTypes[XPathResult.BOOLEAN_TYPE] = "BOOLEAN_TYPE";
	resultTypes[XPathResult.UNORDERED_NODE_ITERATOR_TYPE] = "UNORDERED_NODE_ITERATOR_TYPE";
	nodeTypes = {};
	nodeTypes[1] = ["ELEMENT_NODE",];
	nodeTypes[2] = ["ATTRIBUTE_NODE",];
	nodeTypes[3] = ["TEXT_NODE",];
	nodeTypes[4] = ["CDATA_SECTION_NODE",];
	nodeTypes[9] = ["DOCUMENT_NODE",];
	parser=new DOMParser();

	// save for reset
	var inTextarea = $('#in').val();
	var contextTextarea = $('#context').val(); 
	var xpathTextarea = $('#xpath').val();

	$('#in, #context, #xpath').on('keyup paste cut change drop blur',function(){
		var it = $(this);
		localStorage[it.attr('id')+"TextareaTemp"] = it.val();
	}).each(function(){
		var it = $(this);
		var key = it.attr('id')+"TextareaTemp";
		if (key in localStorage) {
			it.val(localStorage[it.attr('id')+"TextareaTemp"]);
		}
	});

	$('#save').click(function(){
		localStorage.inTextarea = $('#in').val();
		localStorage.contextTextarea = $('#context').val();
		localStorage.xpathTextarea = $('#xpath').val();
	});

	$('#load').click(function(){
		$('#in').val('inTextarea' in localStorage ? localStorage.inTextarea : inTextarea);
		$('#context').val('contextTextarea' in localStorage ? localStorage.contextTextarea : contextTextarea);
		$('#xpath').val('xpathTextarea' in localStorage ? localStorage.xpathTextarea : xpathTextarea);
	});

	$('#reset').click(function(){
		$('#in').val(inTextarea);
		$('#context').val(contextTextarea);
		$('#xpath').val(xpathTextarea);
	});

	function q(text){ return e(text,'"'); }
	function e(text,wrap){ return (wrap!==undefined?wrap:'')+$('<span>').text(''+text).html()+(wrap!==undefined?wrap:'') }
	function d(html,className){
		var d = $('<div/>');
		if (className!==undefined) d.attr('class',className);
		d.append(html);
		return d;
	}
	function span(html,className){
		var jq = $('<span/>');
		if (className!==undefined) jq.attr('class',className);
		jq.append(html);
		return jq;
	}
	
	var lastOne = '';
	$('#eval').click(function(){
		var out = $('#out'); out.html('');
		var errFocus;
		try {
			errFocus = $('#in');
			xmlDoc=parser.parseFromString($('#in').val(),"text/xml");
			$('#out').css('color','').text('');
			var context = xmlDoc.documentElement;
			if ($('#context').val().trim()!='') {
				errFocus = $('#context');
				var one = xmlDoc.evaluate($('#context').val(),xmlDoc.documentElement,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);
				context = one.singleNodeValue;
				if (context===null) {
					$('#out').css('color','red').val("Context XPath Expression didn't return a valid node: "+$('#context').val());
					$('#context').effect("highlight",{'color':'#f88'},500).focus();
					return false;
				}
			}				
			errFocus = $('#xpath');
			var xpaths = $('#xpath').val().split('\n');
			var sep = false;
			for(k = 0; k<xpaths.length; k++) if (xpaths[k].trim()!=='') {
				xp = xpaths[k];
				var it = xmlDoc.evaluate(xp,context,null,XPathResult.ANY_TYPE,null);
				if (it.resultType in resultTypes) {
					out.append(sep);
					out.append(d('<label>XPath</label> <span>'+e(xp)+'</span>','xpath-expression'));
					out.append(d(span(resultTypes[it.resultType],'keyword type-name'),'resultset-type'));
					sep = '<hr/>'; 
					if (it.resultType==XPathResult.STRING_TYPE) {
						out.append(q(it.stringValue))
					} else if (it.resultType==XPathResult.NUMBER_TYPE) {
						out.append(it.numberValue)
					} else if (it.resultType==XPathResult.BOOLEAN_TYPE) {
						out.append(it.booleanValue)
					} else if (it.resultType!==XPathResult.UNORDERED_NODE_ITERATOR_TYPE) {
						out.append(it)
					} else {
						var any = false;
						while ((o = it.iterateNext())!==null) {
							any = true;
							if (o.nodeType in nodeTypes) {
								if (nodeTypes[o.nodeType]=="TEXT_NODE") {
									out.append(d('<span>'+nodeTypes[o.nodeType]+'</span> '+q(o.textContent),'result-list-item'));
								} else if (nodeTypes[o.nodeType]=="ATTRIBUTE_NODE") {
									out.append(d('<span>'+nodeTypes[o.nodeType]+'</span> '+e(o.name)+'='+q(o.textContent),'result-list-item'));
								} else if (nodeTypes[o.nodeType]=="DOCUMENT_NODE") {
									out.append(d('<span>'+nodeTypes[o.nodeType],'result-list-item'));
								} else if (nodeTypes[o.nodeType]=="ELEMENT_NODE") {
									var text = e('<'+o.tagName);
									aList = o.attributes;
									if (aList && aList.length) {
										ai = -1;
										while(++ai<aList.length) {
											a = aList[ai];
											text += e(' '+a.name+'="'+$('<span>').text(a.textContent).html()+'"');
										}
									}
									nList = o.childNodes;
									if (nList.length) {
										text += e('>')+'<i><b>'+nList.length+'</b> child node'+(nList.length>1?'s':'')+'</i>'+e('</'+o.tagName+'>')+'<br/>';
									} else {
										text += e('/>\n');
									}
									out.append(d('<span>'+nodeTypes[o.nodeType]+'</span> '+text,'result-list-item'));
								} else {
									out.append(d('<span>'+nodeTypes[o.nodeType]+'</span> '+e(o)));
								}
							} else {
								out.append(d(e('Unknown Node Type: '+o.nodeType+ ' '+o)));
							}
						}
					}
					if (!any) {
						out.append(d(e('--Empty Set--'),'unexpected-result'));
					}
				} else {
					out.append(d(e('--Unknown type--'),'unexpected-result'));
					$('#out').effect("highlight",{'color':'red'},500);
					return;
				}
			}
			$('#xpath').focus();
			out.effect("highlight",{},1000);
		} catch(ex) {'messge' 
			out.css('color','red');
			out.append(e(
				'Exception: '+
				('name' in ex?ex.name:'UNKNOWN NAME')+
				('code' in ex?' ('+ex.code+')\n\n':'(?)\n\n')+
				('message' in ex?ex.message+'\n\n':'UNKNOWN MESSAGE\n\n')+
				('stack' in ex?ex.stack:'')
			));
			errFocus.effect("highlight",{'color':'#f88'},1000).focus();
		}

		return false;
	});
