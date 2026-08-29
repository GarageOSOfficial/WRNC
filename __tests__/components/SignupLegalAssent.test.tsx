import React from 'react';
import { render } from '@testing-library/react-native';
import { SignupLegalAssent } from '../../components/legal/SignupLegalAssent';

describe('SignupLegalAssent', () => {
  it('remains hidden until explicitly enabled after legal approval', () => {
    const assent = render(<SignupLegalAssent onPrivacy={jest.fn()} onTerms={jest.fn()} />);
    expect(assent.queryByLabelText('Legal agreement')).toBeNull();
  });
});
