<Navigator
    initialRoute={{
        name: componentName,
        component: component
    }}
    configureScene={(route) => {
        return Navigator.SceneConfigs.FloatFromRight;
    }}
    renderScene={(route, navigator)=>{
        const Component = route.component;
        return <Component {...route.params} navigator={navigator}/>
    }}/>
{this.renderTabBarItem('首页','icon_tabbar_homepage','icon_tabbar_homepage_selected','home','首页',Home)}
{this.renderTabBarItem('商家','icon_tabbar_merchant_normal','icon_tabbar_merchant_selected','shop','商家',Shop)}
{this.renderTabBarItem('我的','icon_tabbar_mine','icon_tabbar_mine_selected','mine','我的',Mine)}
{this.renderTabBarItem('消息','icon_tabbar_news','icon_tabbar_news_selected','news','消息',News)}