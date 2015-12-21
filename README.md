# Nori Webinterface

[![Join the chat at https://gitter.im/alexus37/NoriV2Webinterface](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/alexus37/NoriV2Webinterface?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

The purpose of this web app is to be a web interface for the nori renderer. The whole process is very interactive and self-explanatory and can be done with every state-of-the-art web browser.

# Requirements

- pip (which python version?)
- npm(/node)
- cmake
- redis
`
sudo apt-get install redis-server
`

Make sure redis is running

# Bootstrapping

Run `npm install` and `pip install -r requirements.txt` to install the requirements for the webapp

## Compile Nori
Checkout the readme file from the [nori repro][nori].

# Run (Server) in development environment

in the server directory run:

` 
./runserver
`

to stop the server run 

`
./stopserver
`
# Data

Note that there is no data included for the default scene.

# Structure

- "server" contains the django server handling user and scene API as well as the connection to the renderer
- "app" contains the angularjs client frontend
- "NoriV2" contains the renderer

# Contact

For more information on the nori web interface please contact me.


[web-app]: https://bitbucket.org/Alexus/noriwebinterface
[git]: http://git-scm.com/
[node]: http://nodejs.org/
[cmake]: http://www.cmake.org/download/
[protractor]: https://github.com/angular/protractor
[bower]: http://bower.io/
[http-server]: https://github.com/nodeapps/http-server
[karma]: https://github.com/karma-runner/karma
[pip]: https://bootstrap.pypa.io/get-pip.py
[webapp]: http://localhost:7001
[nori]: https://github.com/alexus37/NoriV2

[linuxCmake]: app/images/linux-cmake.png?raw=true "Set the build type to Unix Makefiles and then press the Configure and Generate buttons."
