import * as React from 'react';
import Logo from '@/assets/logo.png';

class Header extends React.Component {
    public render() {
        return (
          <div style={{height: '40px', borderBottom: '1px solid #CCC', alignItems: 'center'}}>
              <img style={{height: '35px'}} src={Logo} />
          </div>
        );
    }
}

export default Header;
