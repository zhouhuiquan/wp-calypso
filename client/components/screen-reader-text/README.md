Screen Reader Helpers
=====================

> The purpose of screen-reader targeted text is to provide additional context for links, document structure, and form fields. Usually, that context is readily available to a sighted user because of visual cues and familiar patterns.

[Hiding text for screen readers with WordPress Core](https://make.wordpress.org/accessibility/2015/02/09/hiding-text-for-screen-readers-with-wordpress-core/)

Calypso uses the same screen-reader-text class as WP core, but we've added 2 components as helpers (and to get around the className namespace rules 😉)

## ScreenReaderText

This component has no props, and only accepts `children`. It displays `children` wrapped in a div with class="screen-reader-text", making it invisible for sighted users, but audible for screen reader users.

## ScreenReaderLabel

This component has a required prop of `htmlFor`, and accepts `children`. It displays `children` wrapped in a label with class="screen-reader-text", making it invisible for sighted users, but audible for screen reader users. The `htmlFor` prop should correspond to the ID of a nearby input. This component should only be used if the input's purpose is clear from visual cues, otherwise use a visible label.
