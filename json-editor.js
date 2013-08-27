angular.module('Editor', []);

angular.module('Editor').directive('alJsonEditor', function($compile){

  var delete_button = function(path){
    return '<span ng-click="del(\'' + path.join('.') + '\')" class="badge badge-important">del</span>';
  };


  var add_buttons = function(path){
    return  '<tr><td>' +
    '<input placeholder="Key name" style="margin:0 5px 0" ng-model="names[\'' + path.join('.') + '\']" type="text" class="span2">' +
    '</td><td><div class="btn-group">' +
      '<button ng-click="add(\'' + path.join('.') + '\', \'\')" class="btn">+ Primitive</button>' +
      '<button ng-click="add(\'' + path.join('.') + '\', [])" class="btn">+ Array</button>' +
      '<button ng-click="add(\'' + path.join('.') + '\', {})" class="btn">+ Object</button>' +
    '</div></td></tr>';
  };

  var primitive_editor = function(path){
    return  '<tr><td><span class="badge badge-inverse">' + path[path.length-1] +
      '</span>' +
      "<span class='badge'>{{ typename('" + path.join('.') + "') }}</span>" +
      delete_button(path) +
      '</td><td><input ng-model="' + path.join('.') + '"></td></tr>';
  };

  var simple_html = function(obj, path){
    var rows = [];
    angular.forEach(obj, function(val, key){
      var p = angular.copy(path);
      p.push(key);
      if(angular.isArray(val) || angular.isObject(val)){
        rows.push(simple_html(val, p));
      } else {
        rows.push(primitive_editor(p));
      }
    });

    var final_row = '<table class="table table-bordered table-striped"><tbody>' +
      rows.join('') + add_buttons(path) + '</tbody></table>';

    if (path.length > 1){
      var current_key = path[path.length - 1];
      return  '<tr><td><span class="badge badge-inverse">' + current_key +
        '</span>' +
        "<span class='badge'>{{ typename('" + path.join('.') + "') }}</span>" +
        delete_button(path) +
        '</td><td>' + final_row + '</td></tr>';
    }
    return final_row;
  };

  return {
    scope: {
      obj: '='
    },
    link: function(scope, elem, attr){
      var path = ['obj'];
      scope.names = {};
      scope.del = function(path){
        var parts = path.split('.');
        var to_delete = parts.pop();
        var current_object = scope;

        while(key = parts.shift()) current_object = current_object[key];

        if(angular.isArray(current_object)){
          var index = +to_delete;
          current_object.splice(index, 1);
        } else {
          delete current_object[to_delete];
        };
        redraw();
      };

      scope.typename = function(path){
        var o = scope.$eval(path);
        if(angular.isArray(o)) return 'Array';
        if(angular.isObject(o)) return 'Object';
        return 'String';
      };


      scope.add = function(path, what){
        var current_object = scope.$eval(path);
        var name = scope.names[path];

        if(angular.isArray(current_object)){
          current_object.push(what);
        } else {
          current_object[name] = what;
        };
        redraw();
      };

      var redraw = function(){
        elem.html('');
        elem.append($compile(simple_html(scope.obj, path))(scope));
      };

      scope.$watch('obj', redraw);
    }
  };
});
