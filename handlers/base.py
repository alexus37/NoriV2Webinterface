import tornado.web
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