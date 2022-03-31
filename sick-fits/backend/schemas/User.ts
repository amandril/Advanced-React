import 'dotenv/config';
import { text, password, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

// named exports make the auto imports work better
export const User = list({
  // access:
  // ui:
  fields: {
    name: text({
      isRequired: true,
    }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    // TODO, add roles, cart and orders
  },
});
