import tornado.web
import os
################################################################################################
# MainHandler
# noinspection PyAbstractClass
class BaseHandler(tornado.web.RequestHandler):
    """
    This class represents the base handler.

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

    def getUserDir(self):
        """
        Return the directory of the current user.
        @rtype: C{decode_signed_value}
        @return: The userdirectory
        """
        BASEPATH = self.getBasePath()
        user = self.get_secure_cookie("user")        
        
        return BASEPATH + '/../app/data/' + str(user)

    def getBasePath(self):
        return os.path.dirname(os.path.realpath(__file__))