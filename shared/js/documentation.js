// Init sidebar
$(function() {
  var activeItem,
      helpList = $('#js-sidebar .js-topic'),
      firstOccurance = true;

  // hide list items at startup
  if($('body.api') && window.location){
    var reg = /\/\/[^\/]+(\/.+)/g,
        docUrl = reg.exec(window.location.toString());
    if(docUrl){
      $('#js-sidebar .js-topic a').each(function(){
        var url = $(this).attr('href').toString();
        if(url.indexOf(docUrl[1]) >= 0 && url.length == docUrl[1].length){
          $(this).parent('li').addClass('disable');
          var parentTopic = $(this).parentsUntil('div.sidebar-module > ul').last();
          parentTopic.addClass('js-current');
          parentTopic.find('.js-expand-btn').toggleClass('collapsed expanded');
        }
      });
    }
  }

  $('#js-sidebar .js-topic').each(function(){
    if(($(this).find('.disable').length == 0 || firstOccurance == false) &&
    $(this).hasClass('js-current') != true){
      $(this).find('.js-guides').children().hide();
    } else {
      activeItem = $(this).index();
      firstOccurance = false;
    }
  });

  // Toggle style list. Expanded items stay
  // expanded when new items are clicked.
  $('#js-sidebar .js-toggle-list .js-expand-btn').click(function(){
    var clickedTopic = $(this).parents('.js-topic'),
        topicGuides  = clickedTopic.find('.js-guides li');
    $(this).toggleClass('collapsed expanded');
    topicGuides.toggle(100);
    return false;
  });

  // Accordion style list. Expanded items
  // collapse when new items are clicked.
  $('#js-sidebar .js-accordion-list .js-topic h3 a').click(function(){
    var clickedTopic = $(this).parents('.js-topic'),
        topicGuides = clickedTopic.find('.js-guides li');
    
    if(activeItem != clickedTopic.index()){
      if(helpList.eq(activeItem)){
        helpList.eq(activeItem).find('.js-guides li').toggle(100);
      }
      activeItem = clickedTopic.index();
      topicGuides.toggle(100);
    } else {
      activeItem = undefined;
      topicGuides.toggle(100);
    }

    return false;
  });

  $('.help-search .search-box').focus(function(){
    $(this).css('background-position','0px -25px');
  });

  $('.help-search .search-box').focusout(function(){
    if($(this).val() == ''){
      $(this).css('background-position','0px 0px');
    }
  });

  // Dynamic year for footer copyright
  var currentYear = (new Date).getFullYear();
  $("#year").text( (new Date).getFullYear() );

  // HACK: Hide the third column on the public_wadl table
  $("#public_wadl td:nth-child(3)").hide();
  $("#public_wadl th:nth-child(3)").hide();
  $("#togglePublicAPIDescription").click(function(event){
    $("#public_wadl td:nth-child(3)").toggle();
    $("#public_wadl th:nth-child(3)").toggle();
    event.preventDefault();
  });

  // Since the api list is auto-gened - auto link to mapped help pages
  var url_doc_map = new Object;
  $('.sidebar-module ul li').each(function(index, value){
    var url = $('a' , value).attr('href');
    if (url != undefined) {
      var title = url.replace('.html', '');
      url_doc_map[title] = url;
    }
  });
  $("#public_wadl td:nth-child(1) a").each(function(index){
    var possibleURLObject = $(this);
    var possibleURL = possibleURLObject.text().substring(possibleURLObject.text().indexOf("api/v1/rest") + "api/v1/rest".length);
    jQuery.each(url_doc_map, function(key, value) {
      if (possibleURL.indexOf(key) === 1) {
        // We have a match to potential doc page: rewrite the href
        possibleURLObject.attr('href', "/" + value + "#" + possibleURL);
      }
    });
  });
});