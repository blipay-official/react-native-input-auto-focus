## Installation

```bash
yarn add react-native-input-auto-focus

# or

npm install react-native-input-auto-focus
```

## Usage

```javascript
import React, { useState, useEffect} from 'react';
import { TextInput, View } from 'react-native';
import useAutoFocus from 'react-native-input-auto-focus';

const Home = () => {
  const { getRef, nextFocus } = useAutoFocus();  

  return (
    <View>
      <TextInput
        ref={getRef(0)}
        onSubmitEditing={nextFocus}
        placeholder="will be the first to be focused, on component mount"
      />

      <TextInput
        ref={getRef(1)}
        onSubmitEditing={nextFocus}
        placeholder="will be the second to be focused, after nextFocus call"
      />

      <TextInput
        ref={getRef(2)}
        placeholder="will be third to be focused"
      />
    </View>
  );
};

export default Home;
```

## Usage with react-navigation

```javascript
import React, { useState, useEffect} from 'react';
import { TextInput, View } from 'react-native';
import useAutoFocus from 'react-native-input-auto-focus';

const Home = () => {
  const navigation = useNavigation();
  const { getRef } = useAutoFocus(navigation);

  return (
    <View>
      <TextInput
        ref={getRef(0)}
        onSubmitEditing={nextFocus}
        placeholder="will be the first to be focused, on navigation transitionEnd event"
      />

      <TextInput
        ref={getRef(1)}
        onSubmitEditing={nextFocus}
        placeholder="will be the second to be focused, after nextFocus call"
      />

      <TextInput
        ref={getRef(2)}
        placeholder="will be third to be focused"
      />
    </View>
  )
};

export default Home;
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
