from base import *
from tornado import escape
import os


################################################################################################
# obj uploadHandler
class objUploadHandler(BaseHandler):

    """
    This class is a handler for obj uploads on the following url: /data/lineQuery


    @author: Alexander Lelidis
    @contact: alexlelidis@gmx.de
    @version: 1.0

    """

    def data_received(self, chunk):
        pass

    def fileCheck(self, lFile):
        fname = lFile['filename']
        extn = os.path.splitext(fname)[1]

        if cmp(extn, ".obj") != 0:
            return False

        if cmp(lFile['content_type'], "application/x-tgif") != 0:
            return False

        userPath = self.getUserDir()
        if os.path.exists(userPath + '/obj/' + fname):
            return False

        return True

    def storeFiles(self, lFile):
        fname = lFile['filename']

        if self.fileCheck(lFile):
            userPath = self.getUserDir()
            filePath = userPath + '/obj/' + fname
            fh = open(filePath, 'w')
            fh.write(lFile['body'])
            return True
        return False

    @tornado.web.authenticated
    def post(self):
        """
        Handle http post requests.
        """
        user = self.get_current_user()

        print "New obj upload from " + user
        data = {'msg': 'failure'}
        if self.storeFiles(self.request.files['file'][0]):
            data = {'msg': 'success'}

        # return the result of the operation
        jsonData = escape.json_encode(data)

        self.write(jsonData)
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")

    @tornado.web.authenticated
    def get(self):
    	"""
        Handle http get requests.
        """
        user = self.get_current_user()

        print "New files request from " + user

        # get the user directory
        userDir = self.getUserDir()

        data = os.listdir(userDir + '/obj/')
        print data

        jsonData = escape.json_encode(data)

        self.write(jsonData)
        self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")


