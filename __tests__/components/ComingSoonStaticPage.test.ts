import fs from 'fs';
import path from 'path';

describe('static Coming Soon campaign page', () => {
  const page = fs.readFileSync(path.join(process.cwd(), 'public/coming-soon/index.html'), 'utf8');

  it('ends on the launch status without duplicate footer branding', () => {
    expect(page).toContain('BUILT FOR BUILDERS.');
    expect(page).toContain('COMING SOON');
    expect(page).not.toContain('<footer>');
    expect(page).not.toContain('THE CAR CULTURE PLATFORM</p>');
    expect(page).not.toContain('The OS for Automotive Builders.</p>');
    expect(page).not.toContain('Built for the culture, not the algorithms.</p>');
  });
});
