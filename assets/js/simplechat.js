var app = angular.module('Simple-Chat', [
    'btford.socket-io'
]);
app.factory('socket', ['socketFactory', function (socketFactory) {
    return socketFactory();
}]);
app.controller('HeaderController', ['$scope', '$rootElement', function ($scope, $rootElement) {
    $scope.title = $rootElement.attr('ng-app');
}]);
app.controller('BodyController', ['$scope', '$rootElement', 'socket', function ($scope, $rootElement, socket) {
    $scope.title = $rootElement.attr('ng-app');
    $scope.name = 'Guest';
    $scope.messages = [];

    socket.on('connect', function (payload) {
        //
    });
    socket.on('disconnect', function (payload) {
        //
    });
    socket.on('username', function (username) {
        $scope.name = username;
    });
    socket.on('message', function (message) {
        $scope.messages.push({
            'sender': message.from,
            'time': moment().format('h:mm:ss A'),
            'content': message.content
        });
        setTimeout(function () {
            $('.log').scrollTop($('.log')[0].scrollHeight);
        }, 100);
    });

    $scope.doChat = function () {
        if ($('.chatBox').val() != "") {
            var tmp = $('.chatBox').val();
            if(tmp.indexOf('/nick') != -1) {
                var newName = tmp.split(' ')[1];
                if(newName) {
                    $scope.name = newName;
                    socket.emit('username', $scope.name);
                } else {
                    return;
                }
            } else {
                socket.emit('message', {
                    from: $scope.name,
                    content: $('.chatBox').val()
                });
            }
            $('.chatBox').val('');
        }
    }

    $scope.toggleSettings = function () {
        if ($('.popup-settings').css('display') == 'none') {
            $('.popup-settings').stop(true, true).css('display', 'inline-block').removeClass("zoomOut").addClass("zoomIn");
        } else {
            $('.popup-settings').stop(true, true).removeClass("zoomIn").addClass("zoomOut");
            $('.popup-settings').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $('.popup-settings').css('display', 'none');
                $('.chatBox').focus();
            });
        }
    };

    $scope.changeName = function () {
        $('.chatBox').val('/nick ').focus();
    };

    $scope.toggleAbout = function () {
        if ($('.about').css('display') == 'none') {
            $('.about').stop(true, true).css('display', 'inline-block').removeClass("zoomOut").addClass("zoomIn");
            $('.about').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(document).bind("click", function (e) {
                    if (e.target.className.indexOf("no-dismiss") == -1) {
                        $scope.toggleAbout();
                    }
                });
            });
        } else {
            $('.about').stop(true, true).removeClass("zoomIn").addClass("zoomOut");
            $('.about').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $('.about').css('display', 'none');
                $(document).unbind("click");
                $('.chatBox').focus();
            });
        }
    };

    $(document).ready(function () {
        $(window).resize(function () {
            $('.log').scrollTop($('.log')[0].scrollHeight);
        });
    });
}]);