<?php
/**
 * Generated by PHPUnit_SkeletonGenerator 1.2.0 on 2013-01-21 at 11:04:50.
 */
class VF_CaptchaTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var VF_Captcha
     */
    protected $object;
    protected $label;
    protected $type;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        $this->label = Random::string(); // 10 character random string
        $this->type = VFORM_STRING;
        $this->object = new VF_Captcha($this->label, $this->type);
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {
    }

    /**
     * @covers VF_Captcha::toHtml
     * @todo   Implement testToHtml().
     */
    public function testToHtml()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_Captcha::toJS
     * @todo   Implement testToJS().
     */
    public function testToJS()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }
}
