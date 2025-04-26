(function() {
    angular.module('PasswordStrength', [])
    .controller('FormController', function($scope) {
        // This function runs when the form is submitted
        $scope.submitForm = function() {
            if ($scope.passwordStrength === 4) {
                // Trigger the confetti animation when password is strong
                triggerConfetti();
            }
        };
    })
    .filter('passwordCount', [function() {
        return function(value, peak) {
            var value = angular.isString(value) ? value : '',
                peak = isFinite(peak) ? peak : 7;

            return value && (value.length > peak ? peak + '+' : value.length);
        };
    }])
    .factory('zxcvbn', [function() {
        return {
            score: function() {
                var compute = zxcvbn.apply(null, arguments);
                return compute && compute.score;
            }
        };
    }])
    .directive('okPassword', ['zxcvbn', function(zxcvbn) {
        return {
            restrict: 'AC',
            require: 'ngModel',
            link: function($scope, $element, $attrs, ngModelCtrl) {
                $element.on('blur change keydown', function(evt) {
                    $scope.$evalAsync(function($scope) {
                        var pwd = $scope.password = $element.val();
                        $scope.passwordStrength = pwd ? (pwd.length > 7 && zxcvbn.score(pwd) || 0) : null;
                        ngModelCtrl.$setValidity('okPassword', $scope.passwordStrength >= 2);
                    });
                });
            }
        };
    }]);

    // Function to trigger confetti
    function triggerConfetti() {
        for (let i = 0; i < 100; i++) {
            let confettiPiece = document.createElement('div');
            confettiPiece.classList.add('confetti');
            document.body.appendChild(confettiPiece);

            // Randomize position, size, and animation delay
            confettiPiece.style.left = `${Math.random() * 100}vw`;
            confettiPiece.style.animationDelay = `${Math.random() * 5}s`;
            confettiPiece.style.animationDuration = `${Math.random() * 5 + 3}s`; // 3 to 8 seconds
        }

        // Remove confetti after 8 seconds
        setTimeout(() => {
            const confettis = document.querySelectorAll('.confetti');
            confettis.forEach(confetti => confetti.remove());
        }, 8000);
    }
})();
