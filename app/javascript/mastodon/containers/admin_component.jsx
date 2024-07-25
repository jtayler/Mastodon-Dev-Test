import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { IntlProvider } from 'mastodon/locales';
import { Provider } from'react-redux';
import { store } from '../store';

export default class AdminComponent extends PureComponent {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render () {
    const { children } = this.props;

    return (
      <Provider store={store}>
        <IntlProvider>
          {children}
        </IntlProvider>
    </Provider>
    );
  }

}
