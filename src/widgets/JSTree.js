'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

require('jstree/dist/jstree.min');

require('jstree/dist/themes/default/style.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeView = function (_Component) {
  _inherits(TreeView, _Component);

  function TreeView() {
    _classCallCheck(this, TreeView);

    return _possibleConstructorReturn(this, (TreeView.__proto__ || Object.getPrototypeOf(TreeView)).apply(this, arguments));
  }

  _createClass(TreeView, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.treeData !== this.props.treeData;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var treeData = this.props.treeData;
      if (treeData) {
        (0, _jquery2.default)(this.treeContainer).jstree({
            treeData,
            plugins: ["contextmenu"]
        });
        (0, _jquery2.default)(this.treeContainer).on('changed.jstree', function (e, data) {
          _this2.props.onChange(e, data);
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
          var treeData = this.props.treeData;

          let menuObj = {};
          let propMenus = this.props.contextMenus || [];
          let propMenuChange = this.props.propMenuChange ? this.props.propMenuChange : null;
          let propMenuClick = this.props._onMenuClick;
          if (treeData) {
            (0, _jquery2.default)(this.treeContainer).jstree(true).settings = treeData;

            (0, _jquery2.default)(this.treeContainer).jstree(true).settings.contextmenu = {
                "items": function (data) { // Could be an object directly
                    if (propMenuChange) {
                        let changed = {};
                        const menus = propMenuChange(data, propMenus);
                        menus.map(function (menu) {
                            changed[menu.code] = {
                                "label": menu.label,
                                "action": function (el) {
                                    propMenuClick(data.original, menu.code);
                                }
                            }
                        });
                        return changed;
                    }
                    propMenus.map(function (menu) {
                        menuObj[menu.code] = {
                            "label": menu.label,
                            "action": function (el) {
                                propMenuClick(data.original, menu.code);
                            }
                         }
                     });
                 return menuObj;
              }
             };
            (0, _jquery2.default)(this.treeContainer).jstree(true).refresh();
          }
        }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { ref: function ref(div) {
          return _this3.treeContainer = div;
        } });
    }
  }]);

  return TreeView;
}(_react.Component);

TreeView.propTypes = {
  treeData: _propTypes2.default.object.isRequired,
  onChange: _propTypes2.default.func
};
TreeView.defaultProps = {
  onChange: function onChange() {
    return false;
  }
};
exports.default = TreeView;