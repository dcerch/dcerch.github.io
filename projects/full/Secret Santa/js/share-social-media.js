//Social Media
$('.social-media').click(function() {
  const shareURL = window.location.href + '?planID=' + localStorage.planID;
  const shareTitle = encodeURI('Secret Santa Event');
  const shareText = encodeURI('Check out this secret santa group I made!');
  const socialURL = '';

  switch($(this).attr('id')) {
    case 'share-google':
      socialURL = 'https://plus.google.com/share?url=' + shareURL + '&text=' + shareText;
    break;
    case 'share-facebook':
      socialURL = 'https://www.facebook.com/sharer.php?u=' + shareURL;
    break;
    case 'share-reddit':
      socialURL = 'https://reddit.com/submit?url=' + shareURL + '&title=' + shareTitle;
    break;
    case 'share-twitter':
      socialURL = 'https://twitter.com/intent/tweet?url=' + shareURL + '&text=' + shareTitle;
    break;
    case 'share-linkedin':
      socialURL = 'https://www.linkedin.com/shareArticle?mini=true&url=' + shareURL + '&title=' + shareTitle + '&summary=' + shareText;
    break;
    case 'share-tumblr':
      socialURL = 'https://www.tumblr.com/widgets/share/tool?canonicalUrl=' + shareURL + '&title=' + shareTitle + '&caption=' + shareText;
    break;
    case 'share-pinterest':
      socialURL = 'http://pinterest.com/pin/create/button/?url=' + shareURL;
    break;
    case 'share-blogger':
      socialURL = 'https://www.blogger.com/blog-this.g?u=' + shareURL + '}&n=' + shareTitle + '&t=' + shareText;
    break;
    case 'share-getpocket':
      socialURL = 'https://getpocket.com/edit?url=' + shareURL;
    break;
    case 'share-hackernews':
      socialURL = 'https://news.ycombinator.com/submitlink?u=' + shareURL + '&t=' + shareTitle;
    break;
    case 'share-digg':
      socialURL = 'http://digg.com/submit?url=' + shareURL;
    break;
    case 'share-flipboard':
      socialURL = 'https://share.flipboard.com/bookmarklet/popout?v=2&title=' + shareTitle + '&url=' + shareURL;
    break;
    case 'share-skype':
      socialURL = 'https://web.skype.com/share?url=' + shareURL + '&text=' + shareText;
    break;
    default:
      console.log('Could not find correct social media match.');
      socialURL = shareURL;
  }
  window.open(socialURL);
});
