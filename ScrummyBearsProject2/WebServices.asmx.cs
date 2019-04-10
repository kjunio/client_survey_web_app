using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace ScrummyBearsProject2
{
    /// <summary>
    /// Summary description for WebServices
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class WebServices : System.Web.Services.WebService
    {

       [WebMethod(EnableSession = true)]
       public int LogOn(string username, string pass)
        {
            int userid = 0;

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = "SELECT Username, UserID FROM User WHERE Username=@nameValue and Password=@passValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@nameValue", HttpUtility.UrlDecode(username));
            sqlCommand.Parameters.AddWithValue("@passValue", HttpUtility.UrlDecode(pass));

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            DataTable sqlDt = new DataTable();
            sqlDa.Fill(sqlDt);

            if(sqlDt.Rows.Count > 0)
            {
                //if a user is found, return their id 
                userid = Convert.ToInt32(sqlDt.Rows[0]["userid"]);
            }
                return userid;
        }


        [WebMethod(EnableSession = true)]
        public void ProvideFeedback(string userid, string feedbackNum, string feedbackType, string feedbackText, string feedbackTags, string anonymity)
        {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlInsert = "INSERT INTO feedback (SurveyID, UserID, FeedbackSubject, FeedbackText,  Tags, Anonymtiy) " +
                "VALUES (@surveyValue, @idValue, @subjectValue, @textValue, @feedbackTags, @anonymityvalue);";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlInsert, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@surveyValue", HttpUtility.UrlDecode(feedbackNum));
            sqlCommand.Parameters.AddWithValue("@idValue", HttpUtility.UrlDecode(userid));
            sqlCommand.Parameters.AddWithValue("@subjectValue", HttpUtility.UrlDecode(feedbackType));
            sqlCommand.Parameters.AddWithValue("@textValue", HttpUtility.UrlDecode(feedbackText));
            sqlCommand.Parameters.AddWithValue("@feedbackTags", HttpUtility.UrlDecode(feedbackTags));
            sqlCommand.Parameters.AddWithValue("@anonymityValue", HttpUtility.UrlDecode(anonymity));

            //we are using executenonquery to run a query that does not return any values
            sqlConnection.Open();
            try
            {
                //execute command and store results
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
        }

    }
}
