package delivery

type EmailSender struct{}

func NewEmailSender() *EmailSender {
	return &EmailSender{}
}

func (s *EmailSender) Send(_ []string, _ string) error {
	return nil
}
