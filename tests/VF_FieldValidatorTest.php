<?php
/**
 * Generated by PHPUnit_SkeletonGenerator 1.2.0 on 2013-01-21 at 11:05:33.
 */
class VF_FieldValidatorTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var VF_FieldValidator
     */
    protected $object;
    protected $name;
    protected $type;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        $this->name = Random::string();
        $this->type = VFORM_STRING;

        $this->object = new VF_FieldValidator($this->name, $this->type, array(), array());
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {
    }

    /**
     * @covers VF_FieldValidator::getValidValue
     * @todo   Implement testGetValidValue().
     */
    public function testGetValidValue()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_FieldValidator::getValue
     * @todo   Implement testGetValue().
     */
    public function testGetValue()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_FieldValidator::validate
     * @todo   Implement testValidate().
     */
    public function testValidate()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_FieldValidator::setError
     * @todo   Implement testSetError().
     */
    public function testSetError()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_FieldValidator::getError
     * @todo   Implement testGetError().
     */
    public function testGetError()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }

    /**
     * @covers VF_FieldValidator::getCheck
     * @todo   Implement testGetCheck().
     */
    public function testGetCheck()
    {
        // Remove the following lines when you implement this test.
        $this->markTestIncomplete(
          'This test has not been implemented yet.'
        );
    }
}
