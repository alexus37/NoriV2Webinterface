#!/usr/bin/env python2

import base64
import uuid

import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.options import options
from tornado.options import define
from tornado import autoreload

from handlers.xmlHandler import *
from handlers.myStaticFile import *
from handlers.login import *


################################################################################################
# Main
if __name__ == "__main__":
    tornado.options.parse_command_line()
    define("port", default=7001, help="run on the given port", type=int)
    print("Started tornado on port: %d" % options.port)

    serverSettings = {
        "cookie_secret": base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes),
        "static_path": "app",
        "login_url": "/"
    }

    application = tornado.web.Application([
        (r"/", LoginHandler),
        (r"/xmlrequest", xmlHandler),
        (r"/app/(.*)", MyStaticFileHandler, dict(path=serverSettings['static_path']))
    ], debug=True, **serverSettings)

    application.listen(options.port)
    ioloop = tornado.ioloop.IOLoop().instance()
    autoreload.start(ioloop)
    ioloop.start()

