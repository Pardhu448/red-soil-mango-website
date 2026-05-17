// =============================================================================
//  MANGO VARIETIES — single source of truth
// =============================================================================
//  This is the ONE place to edit mango varieties. The order page reads from
//  here for both the varieties table and the "Mango variety" dropdown.
//
//  TO ADD a variety:    copy a { ... } block, paste it, and edit the fields.
//  TO REMOVE a variety: delete its { ... } block (keep the surrounding [ ]).
//  TO REORDER:          move the { ... } blocks up or down.
//
//  For each variety, also add its photo to:  public/varieties/<image>
//  (see public/varieties/README.md). Filenames are case-sensitive.
// =============================================================================

export interface MangoVariety {
  /** Display name, e.g. 'Banganapalli'. */
  name: string;
  /** One-line description shown in the table (desktop only). */
  description: string;
  /** Price in ₹ per kg for the current season — digits only, no symbol. */
  price: string;
  /** Image filename inside public/varieties/. */
  image: string;
}

export const VARIETIES: MangoVariety[] = [
  {
    name: 'Banganapalli',
    description:
      'Firm, sweet, and largely fiberless, making them excellent for fresh consumption, juices, and canning.',
    price: '120',
    image: 'banganapalli.jpg',
  },
  /*{
    name: 'Dasheri',
    description:
      'Highly sweet and juicy with a strong, pleasant fragrance. Soft and mostly fiberless.',
    price: '140',
    image: 'dasheri.jpg',
  },
  {
    name: 'Himayat (Imam Pasand)',
    description:
      'Exceptionally sweet with a subtle, complex tanginess. Soft, completely fiberless, and abundant in juice.',
    price: '150',
    image: 'himayat.jpg',
  },*/
];
