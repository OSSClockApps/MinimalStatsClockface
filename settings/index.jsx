function Settings(props){
  return (
    <Page>
      <Section
        title={<Text bold align="center">Primary Color</Text>}>
        <ColorSelect
          settingsKey="primaryColor"
          colors={[
            {color: 'lightcoral'},
            {color: 'lightsalmon'},
            {color: 'salmon'},
            {color: 'indianred'},
            {color: 'crimson'},
            {color: 'red'},
            {color: 'firebrick'},
            {color: 'darkred'},
            {color: 'orange'},
            {color: 'darkorange'},
            {color: 'coral'},
            {color: 'tomato'},
            {color: 'orangered'},            
          ]}
        />
      </Section>
      <Section
        title={<Text bold align="center">Secondary Color</Text>}>
        <ColorSelect
          settingsKey="secondaryColor"
          colors={[
            {color: 'lightskyblue'},
            {color: 'steelblue'},
            {color: 'lightsteelblue'},
            {color: 'lightblue'},
            {color: 'powderblue'},
            {color: 'skyblue'},
            {color: 'cornflowerblue'},
            {color: 'deepskyblue'},
            {color: 'dodgerblue'},
            {color: 'royalblue'},
            {color: 'blue'},
            {color: 'mediumblue'},
            {color: 'darkblue'},
            {color: 'navy'},
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(Settings);