$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
$scope.series = ['Series A', 'Series B'];

var dataA = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
];
var dataB = [
    [11, 33, 54, 86, 51, 97, 33],
    [64, 53, 24, 21, 56, 12, 90]
];
$scope.data =dataA;
$scope.onClick = function (points, evt) {
    $log.debug(points, evt);
};
