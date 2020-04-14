import { PdfGenerator } from './pdf-generator';

describe('PdfGenerator', () => {
  it('should create an instance', () => {
    expect(new PdfGenerator()).toBeTruthy();
  });
});
