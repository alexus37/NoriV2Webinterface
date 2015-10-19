import tornado.web
import sys


# noinspection PyAbstractClass
class MyStaticFileHandler(tornado.web.StaticFileHandler):
    """
    This class is a static file handler listening on the following
    url: /app/(.*)


    @author: Alexander Lelidis
    @contact: alelidis@student.ethz.ch
    @version: 1.0

    """
    def get_current_user(self):
        """
        Return the cookie of the current user.
        @rtype: C{decode_signed_value}
        @return: The cookie.
        """
        return self.get_secure_cookie("user")

    def get(self, path):
        """
        Handle http get requests.
        @param path: The path to the file.
        @type path: C{str}
        """

        # check if it is login object

        if cmp(path, "js/prefixfree.min.js") == 0 or cmp(path, "images/loginBG.jpg") == 0:
            tornado.web.StaticFileHandler.get(self, path)
        else:
            self.getSaveFiles(path)

    @tornado.web.authenticated
    def getSaveFiles(self, path):
        """
        Return a static file.
        @param path: The path to the file.
        @type path: C{str}
        """
        # check if the user is the admin and is allowed to see the user settings site
        # if(cmp(path,"view3/view3.html") == 0 and
        # cmp(self.current_user, "Admin") != 0):
        # print "Access tried"
        # path = "accessDenied.html"

        tornado.web.StaticFileHandler.get(self, path)