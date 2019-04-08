import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme'; // eslint-disable-line import/no-extraneous-dependencies
import { translationMessages } from '@/i18n';

// Create the IntlProvider to retrieve context for wrapping around.
export const generateIntlInstance = (locale) => {
  const intlProvider = new IntlProvider({
    locale,
    messages: translationMessages[locale],
  }, {});

  const { intl } = intlProvider.getChildContext();
  return intl;
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
const nodeWithIntlProp = (node, intl) => (
  React.cloneElement(node, { intl })
);

export const shallowWithIntl = (node, { context = {}, locale = 'en' } = {}) => {
  const intl = generateIntlInstance(locale);

  return shallow(
    nodeWithIntlProp(node, intl),
    {
      context: {
        ...context,
        intl,
      },
    }
  );
};

export const mountWithIntl = (node, { context = {}, childContextTypes = {}, locale = 'en' } = {}) => {
  const intl = generateIntlInstance(locale);
  return mount(
    nodeWithIntlProp(node),
    {
      context: {
        ...context,
        intl,
      },
      childContextTypes: {
        intl: intlShape,
        ...childContextTypes,
      },
    }
  );
};
