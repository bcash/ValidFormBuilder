<?php
/**
 * Generated by PHPUnit_SkeletonGenerator 1.2.0 on 2013-01-21 at 10:56:10.
 */
class ClassDynamicTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var ClassDynamic
     */
    protected $object;

    /**
     * Sets up the fixture, for example, opens a network connection.
     * This method is called before a test is executed.
     */
    protected function setUp()
    {
        $this->object = new ClassDynamic;
    }

    /**
     * Tears down the fixture, for example, closes a network connection.
     * This method is called after a test is executed.
     */
    protected function tearDown()
    {
    }

    /**
     * @covers ClassDynamic::__get
     * @expectedException BadMethodCallException
     */
    public function test__getTrowsBadMethodCallException()
    {
        $this->object->__get(Random::string());
    }

    /**
     * @covers ClassDynamic::__set
     * @expectedException BadMethodCallException
     */
    public function test__setTrowsBadMethodCallException()
    {
        $this->object->__set(Random::string(), Random::string());
    }

    /**
     * @covers ClassDynamic::__call
     * @expectedException BadMethodCallException
     */
    public function test__callTrowsBadMethodCallException()
    {
        $this->object->__call(Random::string(), Random::string());
    }

    /**
     * @covers ClassDynamic::__get
     */
    public function test__getReturnsFormName()
    {
        $strFormName = Random::string();
        $objForm = new ValidForm($strFormName);

        $this->assertEquals($objForm->getName(), $strFormName);
    }

    /**
     * @covers ClassDynamic::__set
     */
    public function test__setSetsNewFormName()
    {
        $strFormName = Random::string();
        $strNewFormName = Random::string();

        $objForm = new ValidForm($strFormName);
        $objForm->setName($strNewFormName);

        $this->assertNotEquals($objForm->getName(), $strFormName);
        $this->assertEquals($objForm->getName(), $strNewFormName);
    }
}
