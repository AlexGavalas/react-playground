import type { ComponentMeta, ComponentStory } from '@storybook/react';

import { DemoComponent } from './demo';

const config: ComponentMeta<typeof DemoComponent> = {
    title: 'Demo',
    component: DemoComponent,
};

export default config;

const Template: ComponentStory<typeof DemoComponent> = (args) => (
    <DemoComponent {...args} />
);

export const FirstStory = Template.bind({});

export const SecondStory = Template.bind({});
SecondStory.args = {
    text: 'with props !!',
};
