from base import *
import os

################################################################################################
# Main
# noinspection PyAbstractClass
class LoginHandler(BaseHandler):
    """
    This class is a login handler listening on the following
    url: /


    @author: Alexander Lelidis
    @contact: alelidis@student.ethz.ch
    @version: 1.0

    """
    def get(self):
        """
        Handle http get requests.
        """
        self.render("../login.html")

    def post(self):
        """
        Handle http post requests.
        """
        
        username = self.get_argument("username")
        password = self.get_argument("password", "")
        
        if cmp(username, "testUser") == 0 and cmp(password, "alex123") == 0:
            print("User(%s) logged in" % str(username))
            self.set_secure_cookie("user", username)

            userDir  = self.getBasePath() + '/../app/data/' + str(username)
            if not os.path.exists(userDir):
                os.makedirs(userDir)
                os.makedirs(userDir + '/img')
                os.makedirs(userDir + '/xml')
                os.makedirs(userDir + '/exr')
                os.makedirs(userDir + '/obj')

            self.redirect(u"/app/index.html")
        else:
            self.redirect(u"/")


