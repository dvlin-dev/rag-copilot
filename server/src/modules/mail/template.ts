export const getChineseTemplate = (
  code: string,
  date: string
) => `<div style="background-color: #ffffff; font-family: HelveticaNeue, Helvetica, Arial, sans-serif">
<table
  align="center"
  role="presentation"
  cellSpacing="0"
  cellPadding="0"
  border="0"
  width="100%"
  style="
    max-width: 37.5em;
    background-color: #ffffff;
    border: 1px solid #eee;
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(20, 50, 70, 0.2);
    margin-top: 20px;
    width: 360px;
    margin: 0 auto;
    padding: 68px 0 130px;
  "
>
  <tr style="width: 100%">
    <td>
      <img
        alt="Plaid"
        src=${logo}
        height="88"
        style="display: block; outline: none; border: none; text-decoration: none; margin: 0 auto"
      />
      <p
        style="
          font-size: 11px;
          line-height: 16px;
          margin: 16px 8px 8px 8px;
          color: #0a85ea;
          font-weight: 700;
          font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
          height: 16px;
          letter-spacing: 0;
          text-transform: uppercase;
          text-align: center;
        "
      >
        验证码
      </p>
      <h1
        style="
          color: #000;
          display: inline-block;
          font-family: HelveticaNeue-Medium, Helvetica, Arial, sans-serif;
          font-size: 17px;
          font-weight: 500;
          line-height: 24px;
          margin-bottom: 0;
          margin-top: 0;
          text-align: center;
          width: 100%
        "
      >
        验证码30分钟内有效，请在有效期内校验
      </h1>
      <table
        style="
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
          margin: 16px auto 14px;
          vertical-align: middle;
          width: 280px;
        "
        align="center"
        border="0"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        width="100%"
      >
        <tbody>
          <tr>
            <td>
              <p
                style="
                  font-size: 32px;
                  line-height: 40px;
                  margin: 0 auto;
                  color: #000;
                  display: inline-block;
                  font-family: HelveticaNeue-Bold;
                  font-weight: 700;
                  letter-spacing: 6px;
                  padding-bottom: 8px;
                  padding-top: 8px;
                  width: 100%;
                  text-align: center;
                "
              >
                ${code}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <p
        style="
          font-size: 15px;
          line-height: 23px;
          margin: 0;
          color: #444;
          font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
          letter-spacing: 0;
          padding: 0 40px;
          text-align: center;
        "
      >
        不希望收到邮件?
      </p>
      <p
        style="
          font-size: 15px;
          line-height: 23px;
          margin: 0;
          color: #444;
          font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
          letter-spacing: 0;
          padding: 0 40px;
          text-align: center;
        "
      >
        如果你不想收到这个邮件请联系<a
          target="_blank"
          style="color: #444; text-decoration: underline"
          href="mailto:ldeveloperlinks@163.com"
          >developerlinks@163.com</a
        >
      </p>
      <p
        style="
          font-size: 15px;
          line-height: 23px;
          margin: 0;
          color: #444;
          font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
          letter-spacing: 0;
          padding: 0 40px;
          text-align: center;
          margin-top: 20px
        "
      >
        ${date}
      </p>
    </td>
  </tr>
</table>
<p
  style="
    font-size: 12px;
    line-height: 23px;
    margin: 0;
    color: #000;
    font-weight: 800;
    letter-spacing: 0;
    margin-top: 20px;
    font-family: HelveticaNeue, Helvetica, Arial, sans-serif;
    text-align: center;
    text-transform: uppercase;
  "
>
  Securely powered by devlink.
</p>
</div>
`;

const logo = `data:image/png;base64,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`;

// TODO: 邀请他人协作🔗：https://demo.react.email/preview/vercel-invite-user?view=desktop
