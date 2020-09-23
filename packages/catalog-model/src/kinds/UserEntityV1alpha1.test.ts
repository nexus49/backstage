/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EntityPolicy } from '../types';
import {
  UserEntityV1alpha1,
  UserEntityV1alpha1Policy,
} from './UserEntityV1alpha1';

describe('UserV1alpha1Policy', () => {
  let entity: UserEntityV1alpha1;
  let policy: EntityPolicy;

  beforeEach(() => {
    entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'doe',
      },
      spec: {
        type: 'employee',
        profile: {
          displayName: 'John Doe',
          email: 'john@doe.org',
          picture: 'https://doe.org/john.jpeg',
        },
        memberOf: ['org-a', 'department-b', 'team-c', 'developers'],
        directMemberOf: ['team-c', 'developers'],
      },
    };
    policy = new UserEntityV1alpha1Policy();
  });

  it('happy path: accepts valid data', async () => {
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  // root

  it('silently accepts v1beta1 as well', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta1';
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects unknown apiVersion', async () => {
    (entity as any).apiVersion = 'backstage.io/v1beta0';
    await expect(policy.enforce(entity)).rejects.toThrow(/apiVersion/);
  });

  it('rejects unknown kind', async () => {
    (entity as any).kind = 'Wizard';
    await expect(policy.enforce(entity)).rejects.toThrow(/kind/);
  });

  // type

  it('rejects missing type', async () => {
    delete (entity as any).spec.type;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects wrong type', async () => {
    (entity as any).spec.type = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  it('rejects empty type', async () => {
    (entity as any).spec.type = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/type/);
  });

  // profile

  it('accepts missing profile', async () => {
    delete (entity as any).spec.profile;
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong profile', async () => {
    (entity as any).spec.profile = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/profile/);
  });

  it('accepts missing displayName', async () => {
    delete (entity as any).spec.profile.displayName;
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong displayName', async () => {
    (entity as any).spec.profile.displayName = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/displayName/);
  });

  it('rejects empty displayName', async () => {
    (entity as any).spec.profile.displayName = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/displayName/);
  });

  it('accepts missing email', async () => {
    delete (entity as any).spec.profile.email;
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong email', async () => {
    (entity as any).spec.profile.email = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/email/);
  });

  it('rejects empty email', async () => {
    (entity as any).spec.profile.email = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/email/);
  });

  it('accepts missing picture', async () => {
    delete (entity as any).spec.profile.picture;
    await expect(policy.enforce(entity)).resolves.toBe(entity);
  });

  it('rejects wrong picture', async () => {
    (entity as any).spec.profile.picture = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/picture/);
  });

  it('rejects empty picture', async () => {
    (entity as any).spec.profile.picture = '';
    await expect(policy.enforce(entity)).rejects.toThrow(/picture/);
  });

  // memberships

  it('rejects missing memberOf', async () => {
    delete (entity as any).spec.memberOf;
    await expect(policy.enforce(entity)).rejects.toThrow(/memberOf/);
  });

  it('rejects wrong memberOf', async () => {
    (entity as any).spec.memberOf = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/memberOf/);
  });

  it('rejects wrong memberOf item', async () => {
    (entity as any).spec.memberOf[0] = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/memberOf/);
  });

  it('rejects missing directMemberOf', async () => {
    delete (entity as any).spec.directMemberOf;
    await expect(policy.enforce(entity)).rejects.toThrow(/directMemberOf/);
  });

  it('rejects wrong directMemberOf', async () => {
    (entity as any).spec.directMemberOf = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/directMemberOf/);
  });

  it('rejects wrong directMemberOf item', async () => {
    (entity as any).spec.directMemberOf[0] = 7;
    await expect(policy.enforce(entity)).rejects.toThrow(/directMemberOf/);
  });
});
