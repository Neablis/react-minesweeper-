var React = require('react/addons');
var MainPage = require('../../../../assets/frontend/components/dashboard/MainPage.js');
var TestUtils = React.addons.TestUtils;
var chai       = require('chai');  
var expect     = chai.expect;  

describe('MainPage h1 component', function(){
  it('h1 should have value', function() {

    var mainPage = TestUtils.renderIntoDocument(<MainPage />);

    var h1 = TestUtils.findRenderedDOMComponentWithTag(mainPage, 'h1');
        
    expect(h1.getDOMNode().textContent).to.equal('Home Page');
  });
});