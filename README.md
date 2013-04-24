# Facebook Friend Search

A form controller that allows users to search and manually select a person
from their Facebook friends.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/hatchddigital/fbfs/master/dist/fbfs.min.js
[max]: https://raw.github.com/hatchddigital/fbfs/master/dist/fbfs.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/fbfs.min.js"></script>
<script>
    $('.fbfs').fbfs({
        'onUserSelect': function (user) {
            var $user_list = $('.selected-users')
              , $user_item = $('<li class="su-user">' + user.name + '</li>');
            $user_list.append($user_item);
        }
    });
</script>
<form class="fbfs" action="" method="get" autocomplete="off">
    <input type="text" autocomplete="off"
           name="search" class="search"
           placeholder="Start typing the name of your friend" />
    <ul class="facebook-friends"></ul>
</form>
```

## Documentation
The FBFS module/plugin will require the current user to have access to
their Facebook account. You will need to login a user + gain access to
`friends_status, read_friendlists` authentication requirements.

This should be done BEFORE the FBFS code is attached to any HTML markup
on your page. A very simple FB setup would look like:

```html
<script>
  window.fbAsyncInit = function() {
    // init the FB JS SDK
    FB.init({
      appId      : 'APP_ID',
      status     : true,
      cookie     : true,
      xfbml      : true
    });
    // Check login status and get it if required
    FB.getLoginStatus(function(response) {
      if (response.status !== 'connected') {
        FB.login({'scope': 'friends_status,read_friendlists'});
      }
     });
  };
  // Load the SDK's source Asynchronously
  // Note that the debug version is being actively developed and might
  // contain some type checks that are overly strict.
  // Please report such bugs using the bugs tool.
  (function(d, debug){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
     ref.parentNode.insertBefore(js, ref);
   }(document, /*debug*/ false));
</script>
```

This code will ensure the user is logged into FB and has the correct
authentication for the application. You must create a unique APP ID
attached to the domain this code runs on for it to work.

Once the user is logged in searching will automatically function as the
user types into the search box provided.

The on `onUserSelect` callback will allow your application to customize
what happens when a user has been selected. This callback will be provided
a name and a UID which can be used to perform your own FB queries such as
finding all the users posts, sending them a message, etc.

## Examples
A working example of this script can be seen in `examples/index.html` which
will allow users to search their friends list and add each selected friend
to an HTML list on the page.

Please note that if you wish to use this example you must provide your own
working APP_ID in the `<head>` Facebook init code.

## Release History
- v0.1.5 Added errorCallback option which is used for onSearch to allow
user apps to handle FB API errors. The example has a simple use case.
- v0.1.4 Fixing a bug with no preventDefault on user select and changing
example markup to use buttons instead of a broken <a>
- v0.1.3 Added new event for clearing the input with expected markup added to
the example. Moved state-searching to the parent element wrapper not the input.
- v0.1.0 Initial working plugin to allow searching and a simple callback when
a friend is selected by the user of the script.
