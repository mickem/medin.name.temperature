# Homey Temperature Manager

Homey temperature manager is an app designed to make it easy to manage temperature inside your home.
You can set thresholds and get alerts whenever the tempertature in a zone goes outside the thresholds.
There is also cards for when the termperature in a zone changes as well as when the minimum and maximum of a zone is changed.

## Supported Devices

* Any device that reports temperature, i.e. Fibaro Motion Sensor, Aeotec MultiSensor, Xiaomi Aqara Thermometer etc.

## How do I get it to work?
* Configure which zones and devices should be monitored on the settings page.
* Add a flow with the desired actions when the toowarm and toocold alarms are triggered.
* Detailed instructions can be found on the Instructions tab in the apps settings.
* You can also add virtual thermometers (Add new device select temerpature manager).

## Need Help, Have questions or remarks?

## Roadmap
This is an early beta version, so currently the features are limited but basic functionality is there and the app is usable.
Some things which are planne din the near future are:

* Configure indivdual temperature bounds for zones
* notification for when temperature gos out of bounds

## Donate
If you like the app, consider buying me a beer!  
[![Paypal donate][pp-donate-image]][pp-donate-link]

## Changelog

### Version 1.0
* Application released

### Verison 1.1
* Internationalization
* Virtual thermometers


## Help out

### Translations

The project translations are managed at https://poeditor.com/join/project/frV5jaW4lg
You can add languages and help out with translations there.

### Building the project

This project is unlike most other Homey application in that is written in typescript and thus requires compilation.
Due to how athom has designed Homey application this is a bit akward, in essence the "application" has to reside in the root folder.
So we have to plave the source code elsewhere, in this case it is located in the [projects folder](./project).
To build it you need [node installed](https://nodejs.org/en/download/).
Then you can run:
```
cd project
npm install
npm run build
```

Then to ru nthe application on your homey you:
```
cd ..
homey app run
```
Please note that building the application is don from *project* folder  and running the application is done from *root* folder.
A lot of the file sare "the same" but not quite so it has to be in these folder or it wont work.

[pp-donate-link]: https://www.paypal.me/michaelmedin
[pp-donate-image]: https://www.paypalobjects.com/webstatic/en_US/i/btn/png/btn_donate_92x26.png
